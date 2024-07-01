import { Type } from "protobufjs";

function readVarInt(offset: number, buffer: Uint8Array) {
  let result = 0;
  let shift = 0;
  let byte;
  do {
    if (offset >= buffer.length) {
      throw new Error("Buffer overflow while reading varint");
    }
    byte = buffer[offset++];
    result |= (byte & 0x7f) << shift;
    shift += 7;
  } while (byte >= 0x80);
  return [result, offset];
}

function buildBuffer(leftOver: Uint8Array, newValue: Uint8Array) {
  if (leftOver.length === 0) return newValue;

  const buffer = new Uint8Array(leftOver.length + newValue.length);
  buffer.set(leftOver);
  buffer.set(newValue, leftOver.length);
  return buffer;
}

export async function* decodeFileStream(
  massageType: Type,
  stream: ReadableStream<Uint8Array>
) {
  let offset = 0;
  let len = 0;
  let leftOver: Uint8Array =  new Uint8Array(0);

  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done || !value) return;

      const buffer = buildBuffer(leftOver, value);
    
      while (offset < buffer.length) {
        [len, offset] = readVarInt(offset, buffer);
        
        if (offset + len > buffer.length) {
          leftOver = buffer.slice(offset - 1);
          offset = 0;
          break;
        }

        const proto = massageType.decode(buffer.slice(offset, offset + len));
        offset += len;
       
        yield massageType.toObject(proto) as unknown;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
