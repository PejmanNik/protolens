import {
  Alert,
  Autocomplete,
  FormControl,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";
import { useEffect, useMemo, useState } from "react";
import { db } from "../db";
import { useLiveQuery } from "dexie-react-hooks";
import { ProtoFileSelector } from "./ProtoFileSelector";
import { unknownMessageType } from "../constant";

interface Option {
  label: string;
  id: string;
  definitionId: string;
}

export function LoadProtoDataFile() {
  const [message, setMessage] = useState<Option>(unknownMessageType);

  const definitionItems = useLiveQuery(
    () => db.definitions.where("unresolvedImportCount").equals(0).toArray(),
    []
  );

  const messages: Option[] = useMemo(
    () => [
      unknownMessageType,
      ...(definitionItems?.flatMap((x) =>
        x.types.map((t) => ({ id: t, label: t.slice(1), definitionId: x.id }))
      ) ?? []),
    ],
    [definitionItems]
  );

  useEffect(() => {
    if (message !== unknownMessageType && !messages.includes(message)) {
      setMessage(messages[0]);
    }
  }, [message, messages]);

  return (
    <Stack spacing={3}>
      <div>
        <ProtoFileSelector
          messageId={message.id}
          definitionId={message.definitionId}
        />

        <Grid xs={12} md={6} lg={4} paddingInline={"1rem"}>
          <FormControl size="sm">
            <Autocomplete
              startDecorator={
                <Typography level="body-xs">Proto message:</Typography>
              }
              variant="plain"
              disableClearable={true}
              value={message}
              onChange={(_, newValue) => setMessage(newValue)}
              options={messages}
            />
          </FormControl>
        </Grid>
      </div>
      {message === unknownMessageType && (
        <Alert color="warning" variant="soft">
          No proto message is selected, please select a proto message to get
          more accurate deserialization
        </Alert>
      )}
    </Stack>
  );
}
