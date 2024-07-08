import { Box, IconButton, Sheet, Skeleton, Typography } from "@mui/joy";
import { DataFile, db } from "../db";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { FilterInput } from "./FilterInput";

export interface HeaderProps {
  fileId: number;
}

export function Header({ fileId }: HeaderProps) {
  const [data, setData] = useState<DataFile | undefined>(undefined);

  useEffect(() => {
    db.dataFiles.get(fileId).then((data) => setData(data));
  }, [fileId]);

  return (
    <Sheet
      variant="outlined"
      sx={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "neutral.50",
        gap: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography level="title-lg" color="primary">
            {data?.name}
          </Typography>
          <Typography level="title-sm">{data?.messageId}</Typography>
          {!data && (
            <>
              <Skeleton variant="text" level="title-lg" width={'500px'}/>
              <Skeleton variant="text" level="title-sm" width={'200px'}/>
            </>
          )}
        </Box>
        <IconButton size="sm" component={Link} to="/">
          <XMarkIcon />
        </IconButton>
      </Box>

      <FilterInput />
    </Sheet>
  );
}
