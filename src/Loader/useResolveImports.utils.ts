import { ProtoDefinition } from "../db";
import type { INamespace } from "protobufjs";
import protobuf from "protobufjs";

function findNamespace(importPath: string, targets: ProtoDefinition[]) {
  if (importPath.startsWith("google/protobuf/")) {
    // check for well-known types
    const namespace = protobuf.common.get(importPath);
    if (namespace) {
      return namespace;
    }
  }

  const sourceFileName = importPath.split("/").pop();
  for (const target of targets) {
    if (target.name === sourceFileName) {
      return target.descriptor;
    }
  }

  return null;
}

export type Result = Promise<
  Pick<
    ProtoDefinition, "unresolvedImportCount" | "unresolvedImports" | "descriptor"
  >
>;

export async function resolveImports(
  source: INamespace,
  unresolvedImports: string[],
  targetItems: ProtoDefinition[]
): Result {
  const imports = unresolvedImports;
  const resolvedImports: string[] = [];
  const namespace = protobuf.Root.fromJSON(source);

  // this is a naive implementation, it assumes the user
  // take care of package names in imports and only checks
  // the file name to match the import file name
  if (imports?.length) {
    const validItems = targetItems.filter((f) => f.unresolvedImportCount == 0);

    for (const importPath of imports) {
      const targetNamespace = findNamespace(importPath, validItems);
      if (targetNamespace) {
        namespace.root.add(
          protobuf.Namespace.fromJSON(importPath, targetNamespace)
        );
        resolvedImports.push(importPath);
      }
    }
  }

  const unresolved = imports?.filter((i) => !resolvedImports.includes(i)) ?? [];
  return {
    unresolvedImportCount: unresolved.length,
    unresolvedImports: unresolved,
    descriptor: namespace.root.toJSON(),
  };
}
