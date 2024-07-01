import { Box, useTheme } from "@mui/joy";
import { RowContent } from "./RowContent";
import { Ref, forwardRef } from "react";

export interface RowViewerProps {
  index: number;
  data: unknown;
}

function BaseRowViewer(props: RowViewerProps, ref: Ref<HTMLDivElement>) {
  const theme = useTheme();

  return (
    <Box
      ref={ref}
      data-index={props.index}
      sx={{
        display: "flex",
        minHeight: "32px",
        alignItems: "center",
        borderRadius: "11px",
        paddingLeft: "1rem",
        backgroundColor: props.index % 2 === 1 ? "background.body" : undefined,
      }}
    >
      <code style={{ minWidth: "50px", color: theme.palette.neutral[400] }}>
        {props.index}{" "}
      </code>
      <RowContent {...props} />
    </Box>
  );
}

export const RowViewer = forwardRef(BaseRowViewer);
