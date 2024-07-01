import { db } from "../db";
import { resolveImports } from "./ProtoDefinition.utils";
import { useEffect } from "react";
import { parse } from "protobufjs";
import { liveQuery } from "dexie";

export function useResolveImports() {
  useEffect(() => {
    const subscription = liveQuery(() => db.definitions.toArray()).subscribe(
      async (items) => {
        const unresolvedImports =
          items?.filter((x) => x.unresolvedImportCount > 0) ?? [];
        for (const item of unresolvedImports) {
          const result = await resolveImports(parse(item.content), items);

          if (
            result.unresolvedImports.length !== item.unresolvedImports.length
          ) {
            await db.definitions.put({ ...item, ...result });
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
}
