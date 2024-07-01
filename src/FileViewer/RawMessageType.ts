import { Message, Properties, Type } from "protobufjs";
import ReaderMessage from './rawproto'

class RawMessage extends Message {
  properties: Properties<unknown> | undefined;
  public readonly $type: Type;

  constructor(properties?: Properties<unknown>) {
    super(properties);
    this.$type = new RawMessageType();
    this.properties = properties;
  } 
}

export class RawMessageType extends Type {
  constructor() {
    super("RawMessage");
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public decode(reader: Uint8Array): Message<{}> {
    const readerMessage = new ReaderMessage(reader);
    return new RawMessage(readerMessage.toJS());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toObject(message: RawMessage): { [k: string]: any; } {
    return message.properties ?? {};
  }
}