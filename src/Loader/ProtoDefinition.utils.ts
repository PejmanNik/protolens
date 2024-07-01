import type { ProtoDefinition } from "../db";
import {
  IParserResult,
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

type Result = Promise<
  Pick<
    ProtoDefinition,
    "unresolvedImportCount" | "unresolvedImports" | "descriptor"
  >
>;

export async function resolveImports(
  source: IParserResult,
  targetItems: ProtoDefinition[]
): Result {
  const imports = source.imports;
  const resolvedImports: string[] = [];
  let result = source;

  if (imports?.length) {
    const validItems = targetItems.filter(
      (f) => f.unresolvedImportCount == 0 && f.package === result.package
    );

    for (const targetItem of validItems) {
      for (const importPath of imports) {
        const sourceFileName = importPath.split("/").pop();

        if (targetItem.name === sourceFileName) {
          result = parseProtobuf(targetItem.content, result.root);
          resolvedImports.push(importPath);
        }
      }

      if (resolvedImports.length == imports.length) {
        break;
      }
    }
  }

  const unresolvedImports =
    imports?.filter((i) => !resolvedImports.includes(i)) ?? [];
  return {
    unresolvedImportCount: unresolvedImports.length,
    unresolvedImports: unresolvedImports,
    descriptor: result.root.toJSON(),
  };
}
