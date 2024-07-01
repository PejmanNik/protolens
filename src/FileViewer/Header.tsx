import { Box, IconButton, Sheet, Typography } from "@mui/joy";
import { DataFile, db } from "../db";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";

export interface HeaderProps {
  fileId: number;
}

export function Header({ fileId }: HeaderProps) {
  const [data, setData] = useState<DataFile | undefined>(undefined);

  useEffect(() => {
    db.dataFiles.get(fileId).then((data) => setData(data));
  }, [fileId]);

  if (data === undefined) return null;

  return (
    <Sheet
      variant="outlined"
      sx={{
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "neutral.50",
      }}
    >
      <Box>
        <Typography level="title-lg" color="primary">
          {data.name}
        </Typography>
        <Typography level="title-sm">{data.messageId}</Typography>
      </Box>
      <IconButton size="sm" component={Link} to="/">
        <XMarkIcon />
      </IconButton>
    </Sheet>
  );
}
