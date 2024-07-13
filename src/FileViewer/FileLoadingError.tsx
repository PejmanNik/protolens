import { Alert, Box, Button, Typography } from "@mui/joy";

export interface FileLoadingErrorProps {
  error: string;
  reload: () => void;
}
export function FileLoadingError({ error, reload }: FileLoadingErrorProps) {
  const isPermissionError = error.includes("requestPermission");

  return (
    <Box
      sx={{
        placeSelf: "center",
        width: "70%",
      }}
    >
      {isPermissionError && (
        <Alert color="warning">
          <Box display="flex" justifyContent="space-between" width={"100%"}>
            <Box>
              <Typography level="h4" color="warning">
                User permission is required to load the file.
              </Typography>
              <Typography>
                Please click the Reload button and grant read permission
              </Typography>
            </Box>
            <Button onClick={reload} color="warning">
              Reload
            </Button>
          </Box>
        </Alert>
      )}
      {!isPermissionError && (
        <Alert color="danger">
          <Box>
            <Typography level="h4" color="danger">
              An error occurred while loading the file
            </Typography>
            <code>{error}</code>
          </Box>
        </Alert>
      )}
    </Box>
  );
}
