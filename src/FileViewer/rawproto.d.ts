import { Properties } from "protobufjs";

export default class ReaderMessage {
    constructor(reader: Uint8Array);
    toJS(): Properties<unknown> ;
}