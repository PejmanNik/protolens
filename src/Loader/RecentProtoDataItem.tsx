import { DataFile } from "../db";
import { truncateString } from "../utils";
import { Box, ListItem, ListItemDecorator, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import DocumentTextIcon from "@heroicons/react/24/solid/DocumentTextIcon";

export function RecentProtoDataItem({ item }: { item: DataFile; }) {
    const navigate = useNavigate();
    return (
        <ListItem
            onClick={() => navigate(item.id.toString())}
            sx={{ cursor: "pointer" }}
        >
            <ListItemDecorator>
                <DocumentTextIcon />
            </ListItemDecorator>
            <Box>
                {truncateString(item.name, 50)}
                <Typography color="neutral" level="body-sm">
                    {truncateString(item.messageId, 60)}
                </Typography>
            </Box>
        </ListItem>
    );
}
