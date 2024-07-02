import { Alert, Stack } from "@mui/joy";
import { db } from "../db";
import { useLiveQuery } from "dexie-react-hooks";

export function DefinitionsError() {
  const items = useLiveQuery(
    () =>
      db.definitions
        .where("unresolvedImportCount")
        .above(0)
        .reverse()
        .sortBy("id"),
    []
  );

  if (!items?.length) {
    return null;
  }

  return (
    <Alert color="danger" variant="soft">
      <Stack sx={{ maxHeight: "7.5rem", width: "100%", overflow: "auto" }}>
        Some proto definitions have unresolved imports. Please import the
        following files:
        <ul>
          {items.map((unresolvedItem) => (
            <li key={unresolvedItem.id}>
              {unresolvedItem.name}:
              <ul>
                {unresolvedItem.unresolvedImports.slice(0, 3).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Stack>
    </Alert>
  );
}
