import { JSONPath } from "jsonpath-plus";
import { INamespace, Root, Type } from "protobufjs";
import { unknownMessageType } from "../constant";
import { RawMessageType } from "./RawMessageType";
import { errorToString } from "../utils";

export interface WorkerMessage {
  buffer: Uint8Array;
  messageId: string;
  messageNamespace: INamespace;
  filter?: string;
  pageSize: number;
}

export interface WorkerResponse {
  buffer: Uint8Array;
  items: unknown[];
  error?: string;
}

function readVarInt(
  offset: number,
  buffer: Uint8Array
): [len: number, offset: number, bitsRead: number] {
  let result = 0;
  let shift = 0;
  let byte;
  let newOffset = offset;
  do {
    if (offset >= buffer.length) {
      throw new Error("Buffer overflow while reading varint");
    }
    byte = buffer[newOffset++];
    result |= (byte & 0x7f) << shift;
    shift += 7;
  } while (byte >= 0x80);
  return [result, newOffset, newOffset - offset];
}

const messageCache = new Map<string, Type>();

function getType(messageNamespace: INamespace, messageId: string) {
  if (!messageCache.has(messageId)) {
    const type =
      messageId == unknownMessageType.id
        ? new RawMessageType()
        : Root.fromJSON(messageNamespace).lookupType(messageId);

    messageCache.set(messageId, type);
  }

  return messageCache.get(messageId)!;
}

onmessage = async (e) => {
  try {
    const message = e.data as WorkerMessage;

    const type = getType(message.messageNamespace, message.messageId);

    let bitsRead = 0;
    let offset = 0;
    let len = 0;
    let leftOver: Uint8Array = new Uint8Array(0);
    const items: unknown[] = [];

    const evaluateFilter = (item: object, filter: string) => {
      try {
        return JSONPath({ json: item, path: filter }).length > 0;
      } catch {
        return false;
      }
    };

    const buffer = message.buffer;

    while (offset < buffer.length && items.length < message.pageSize) {
      [len, offset, bitsRead] = readVarInt(offset, buffer);

      if (offset + len > buffer.length) {
        leftOver = buffer.slice(offset - bitsRead);
        offset = 0;
        break;
      }

      const proto = type.decode(buffer.slice(offset, offset + len));
      offset += len;

      const item = type.toObject(proto) as object;
      if (!message.filter || evaluateFilter(item, message.filter)) {
        items.push(item);
      }
    }

    const workerResult: WorkerResponse = {
      buffer: leftOver.length > 0 ? leftOver : buffer.slice(offset),
      items: items,
    };

    postMessage(workerResult);
  } catch (e) {
    postMessage({
      error: errorToString(e),
      buffer: new Uint8Array(0),
      items: [],
    });
  }
};
