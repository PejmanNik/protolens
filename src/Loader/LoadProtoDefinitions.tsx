import { Button, Stack, Typography } from "@mui/joy";
import { db } from "../db";
import { toProtoDefinition } from "./ProtoDefinition.utils";
import { useResolveImports } from "./useResolveImports";
import { ProtoDefinitionsList } from "./ProtoDefinitionsList";

export function LoadProtoDefinitions() {
  useResolveImports();

  const selectFile = async () => {
    const [fileHandle] = await window.showOpenFilePicker();
    const item = await toProtoDefinition(fileHandle);

    await db.definitions.put(item);
  };

  return (
    <Stack spacing={1}>
      <Typography level="title-sm">Proto Definitions</Typography>
      <Button onClick={selectFile} size="sm" variant="solid" color="neutral">
        Load Proto Definition
      </Button>
      <ProtoDefinitionsList />
    </Stack>
  );
}
