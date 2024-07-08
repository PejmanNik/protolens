import { Box, Button, Card, LinearProgress, Typography } from "@mui/joy";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { useAtom } from "jotai";
import { filterAtom } from "./state";

export interface RowListLoadingProps {
  onCancel: () => void;
}

export function RowListLoading({ onCancel }: RowListLoadingProps) {
  const [filter, setFilter] = useAtom(filterAtom);

  const handleCancel = () => {
    setFilter(null);
    onCancel();
  };
  return (
    <Box sx={{ width: "50%", placeSelf: "center", marginTop: "6rem" }}>
      <Card color="primary" variant="soft" sx={{ padding: "2rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "--Icon-fontSize": "35px",
            }}
          >
            <MagnifyingGlassIcon />
            <Typography level="title-lg" textAlign={"center"}>
              {filter ? "Searching..." : "Decoding..."}
            </Typography>
          </Box>
          <LinearProgress variant="soft" />
          {filter && (
            <Button
              onClick={handleCancel}
              color="neutral"
              variant="solid"
              sx={{ width: "100%" }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
}
