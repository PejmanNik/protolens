import { db } from "../db";
import { useEffect } from "react";
import { liveQuery } from "dexie";
import { resolveImports } from "./useResolveImports.utils";

export function useResolveImports() {
  useEffect(() => {
    const subscription = liveQuery(() => db.definitions.toArray()).subscribe(
      async (items) => {
        const unresolvedImports =
          items?.filter((x) => x.unresolvedImportCount > 0) ?? [];
        for (const item of unresolvedImports) {
          const result = await resolveImports(
            item.descriptor,
            item.unresolvedImports,
            items
          );

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