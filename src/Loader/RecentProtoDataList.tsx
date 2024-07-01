import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { List } from "@mui/joy";
import { RecentProtoDataItem } from "./RecentProtoDataItem";

export function RecentProtoDataList() {
  const items = useLiveQuery(
    () => db.dataFiles.reverse().limit(5).toArray(),
    []
  );

  if (!items) return null;

  return (
    <List>
      {items.map((x) => (
        <RecentProtoDataItem key={x.id} item={x} />
      ))}
    </List>
  );
}
