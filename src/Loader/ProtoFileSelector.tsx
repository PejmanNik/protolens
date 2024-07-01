import { Button, Typography } from "@mui/joy";
import { DataFile, db } from "../db";
import { useNavigate } from "react-router-dom";

export interface ProtoDataDecoderProps {
  definitionId: string;
  messageId: string;
}

export function ProtoFileSelector({
  messageId,
  definitionId,
}: ProtoDataDecoderProps) {
  const navigate = useNavigate();
  const selectFile = async () => {
    const [fileHandle] = await window.showOpenFilePicker();

    const dataFile = toDataFile(fileHandle, definitionId, messageId);
    const id = await db.dataFiles.put(dataFile);
    navigate(id.toString());
  };

  return (
    <Button
      variant="plain"
      onClick={selectFile}
      sx={{ justifyContent: "start", width: "100%"}}
    >
      <Typography component={"span"} level="h1" sx={{ color: "inherit" }}>
        Select protobuf data file...
      </Typography>
    </Button>
  );
}

function toDataFile(
  fileHandle: FileSystemFileHandle,
  definitionId: string,
  messageId: string
): Omit<DataFile, "id"> {
  return {
    fileHandle,
    name: fileHandle.name,
    definitionId: definitionId,
    messageId: messageId,
  };
}
