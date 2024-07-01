import { Alert, Box, Typography } from "@mui/joy";

export interface FileLoadingErrorProps {
  error: string;
}
export function FileLoadingError({ error }: FileLoadingErrorProps) {
  return (
    <Box
      sx={{
        placeSelf: "center",
        width: "70%",
      }}
    >
      <Alert color="danger">
        <Box>
          <Typography level="h4" color="danger">
            An error occurred while loading the file
          </Typography>
          <code>{error}</code>
        </Box>
      </Alert>
    </Box>
  );
}
