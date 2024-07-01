import { Stack, Typography } from "@mui/joy";
import { RecentProtoDataList } from "./RecentProtoDataList";

export function RecentLoadedProtoData() {
  return (
    <Stack spacing={1}>
      <Typography level="title-sm">Recent</Typography>      
      <RecentProtoDataList />
    </Stack>
  );
}
