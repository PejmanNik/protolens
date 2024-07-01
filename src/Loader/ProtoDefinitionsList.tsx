import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { List } from "@mui/joy";
import { ProtoDefinitionListItem } from "./ProtoDefinitionListItem";

export function ProtoDefinitionsList() {
  const items = useLiveQuery(() => db.definitions.toArray(), []);

  return (
     <List>
       {items?.map((d) => (
          <ProtoDefinitionListItem key={d.id} item={d}           
          />
        ))}
    </List>
  );
}

