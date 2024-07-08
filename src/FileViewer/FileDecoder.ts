import { INamespace } from "protobufjs";
import { WorkerMessage, WorkerResponse } from "./fileDecoderWorker";
import FileDecoderWorker from "./fileDecoderWorker?worker";
import { errorToString } from "../utils";

export class CancellationToken {
  public cancelled: boolean = false;
  public cancel() {
    this.cancelled = true;
  }
}

interface ReadingResult {
  value: unknown[];
  done: boolean;
  busy: boolean;
}

interface Deferred {
  resolve: (value: ReadingResult) => void;
  reject: (reason?: string) => void;
  cancellationToken: CancellationToken;
}

const maxIteration = 100;

export class FileDecoder {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private worker: Worker;
  private isDone: boolean;
  private messageId: string;
  private messageNamespace: INamespace;
  private buffer: Uint8Array;
  private items: unknown[];
  private deferred?: Deferred;
  private pageSize: number = 50;
  private iteration: number;
  private filter: string | null;
  private closed: boolean;

  constructor(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    messageId: string,
    messageNamespace: INamespace,
    filter: string | null
  ) {
    this.iteration = 0;
    this.closed = false;
    this.filter = filter;
    this.reader = reader;
    this.messageId = messageId;
    this.messageNamespace = messageNamespace;
    this.buffer = new Uint8Array(0);
    this.items = [];
    this.worker = new FileDecoderWorker();
    this.worker.onmessage = this.responseHandler.bind(this);
    this.isDone = false;
  }

  read(cancellationToken: CancellationToken) {
    if (this.deferred) {
      return Promise.resolve({ value: [], done: false, busy: true });
    }

    const promise = new Promise<ReadingResult>((resolve, reject) => {
      this.deferred = { resolve, reject, cancellationToken };
    });

    this.sendDecodeRequest(false, this.pageSize);
    return promise;
  }

  private async sendDecodeRequest(insufficientBuffer: boolean, size: number) {
    if (this.closed) return;
    let buffer = this.buffer;
    if (insufficientBuffer || buffer.length < 500) {
      const { value, done } = await this.reader.read();
      buffer = value ? merge(buffer, value) : buffer;
      this.isDone = done;
    }

    this.worker.postMessage({
      buffer: buffer,
      messageId: this.messageId,
      messageNamespace: this.messageNamespace,
      pageSize: size,
      filter: this.filter,
    } as WorkerMessage);
  }

  private responseHandler(e: MessageEvent) {
    if (!this.deferred || this.closed) {
      return;
    }

    try {
      const message = e.data as WorkerResponse;
      if (message.error) {
        this.deferred.reject(message.error);
        return;
      }

      this.buffer = message.buffer;
      this.items = [...this.items, ...message.items];

      const cancelled = this.deferred.cancellationToken.cancelled;
      
      // if there are not enough bytes in the active buffer
      // and the stream is not done, request more 
      const insufficientItems =
        this.items.length < this.pageSize && !this.isDone;
      
        // if we have reached the max iteration count and find at least one item
        // we end the read operation
        const iterationExceeded =
        this.iteration >= maxIteration && this.items.length > 0;

      if (insufficientItems && !cancelled && !iterationExceeded) {
        // read more items
        this.iteration++;
        this.sendDecodeRequest(true, this.pageSize - this.items.length);
        return;
      } 

      // resolve the read promise and reset the state
        this.deferred.resolve({
          value: [...this.items],
          done: this.isDone,
          busy: false,
        });
        this.deferred = undefined;
        this.items = [];
        this.iteration = 0;
      
    } catch (e) {
      this.deferred?.reject(errorToString(e));
    }
  }

  terminate() {
    this.closed = true;
    this.worker.terminate();
    this.reader.cancel();
  }
}

function merge(leftOver: Uint8Array, newValue: Uint8Array) {
  if (leftOver.length === 0) return newValue;

  const buffer = new Uint8Array(leftOver.length + newValue.length);
  buffer.set(leftOver);
  buffer.set(newValue, leftOver.length);
  return buffer;
}
