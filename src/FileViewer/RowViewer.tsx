import { Box, CircularProgress, useTheme } from "@mui/joy";
import { RowContent } from "./RowContent";
import { Ref, forwardRef } from "react";

export interface RowViewerProps {
  index: number;
  data: unknown;
  isLoading: boolean;
}

function BaseRowViewer(
  { isLoading, ...props }: RowViewerProps,
  ref: Ref<HTMLDivElement>
) {
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
        {props.index + 1}{" "}
      </code>
      {!isLoading && <RowContent {...props} />}
      {isLoading && (
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            gap: "1rem",
          }}
        >
          <CircularProgress size="sm" /> Loading...
        </Box>
      )}
    </Box>
  );
}

export const RowViewer = forwardRef(BaseRowViewer);
