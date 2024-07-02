import type { ProtoDefinition } from "../db";
import {
  NamespaceBase,
  Type,
  parse as parseProtobuf,
} from "protobufjs";

export async function toProtoDefinition(fileHandle: FileSystemFileHandle) {
  const file = await fileHandle.getFile();
  const content = await file.text();
  const parserResult = parseProtobuf(content);

  const result: ProtoDefinition = {
    id: `${parserResult.package}.${file.name}`,
    name: file.name,
    fileHandle,
    content,
    package: parserResult.package,
    imports: parserResult.imports ?? [],
    unresolvedImports: parserResult.imports ?? [],
    unresolvedImportCount: parserResult.imports?.length ?? 0,
    descriptor: parserResult.root.toJSON(),
    types: findAllTypes(parserResult.root),
  };

  return result;
}

function findAllTypes(obj: NamespaceBase) {
  const types: string[] = [];
  for (const entry of Object.entries(obj.nested ?? {})) {
    if (entry[1].constructor === Type) {
      types.push((entry[1] as Type).fullName);
    }
    types.push(...findAllTypes(entry[1] as NamespaceBase));
  }

  return types;
}

