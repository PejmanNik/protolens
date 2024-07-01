import {
  Box,
  IconButton,
  ListItem,
  ListItemDecorator,
  Tooltip,
  Typography,
} from "@mui/joy";
import { ProtoDefinition, db } from "../db";
import BackspaceIcon from "@heroicons/react/24/solid/BackspaceIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";

export function ProtoDefinitionListItem({ item }: { item: ProtoDefinition }) {
  const deleteItem = async () => {
    await db.definitions.delete(item.id);
  };

  const isUnresolved = item.unresolvedImportCount > 0;
  return (
    <ListItem
      endAction={
        <IconButton size="sm" color="danger" onClick={deleteItem}>
          <BackspaceIcon />
        </IconButton>
      }
    >
      <ListItemDecorator>
        {isUnresolved && <UnresolvedIcon unresolvedImports={item.imports} />}
        {!isUnresolved && <ResolvedIcon />}
      </ListItemDecorator>
      {item.id}
    </ListItem>
  );
}

function ResolvedIcon() {
  return (
    <Typography
      fontSize="md"
      component="div"
      color="success"
      sx={{
        display: "flex",
      }}
    >
      <CheckCircleIcon />
    </Typography>
  );
}

function UnresolvedIcon({
  unresolvedImports,
}: {
  unresolvedImports: string[];
}) {
  return (
    <Tooltip
      title={
        <Box fontSize={"0.75em"}>
          Unresolved imports:
          <Box sx={{ paddingInlineStart: "1em" }} component={"ul"}>
            {unresolvedImports.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </Box>
        </Box>
      }
      color="warning"
    >
      <Typography
        fontSize="md"
        component="div"
        color="warning"
        sx={{
          display: "flex",
        }}
      >
        <ExclamationCircleIcon />
      </Typography>
    </Tooltip>
  );
}
