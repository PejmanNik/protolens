import { Alert, Stack } from "@mui/joy";
import { db } from "../db";
import { useLiveQuery } from "dexie-react-hooks";

export function DefinitionsError() {
  const items = useLiveQuery(
    () => db.definitions.where("unresolvedImportCount").above(0).toArray(),
    []
  );

  if (!items?.length) {
    return null;
  }

  const unresolvedItem = items[0];

  return (
    <Alert color="danger" variant="soft">
      <Stack>
        {unresolvedItem.name} has {unresolvedItem.unresolvedImportCount}{" "}
        unresolved imports, please import the following files:
        <ul>
          {unresolvedItem.unresolvedImports.slice(0,3).map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Stack>
    </Alert>
  );
}
