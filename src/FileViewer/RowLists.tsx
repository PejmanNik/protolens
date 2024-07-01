import { useEffect, useRef } from "react";
import { useFileDecoder } from "./useFileDecoder";
import { notUndefined, useVirtualizer } from "@tanstack/react-virtual";
import { RowViewer } from "./RowViewer";
import { Box } from "@mui/joy";
import { FileLoadingError } from "./FileLoadingError";

export interface RowListsProps {
  fileId: number;
}

export function RowLists({ fileId }: RowListsProps) {
  const { items, hasNextPage, fetchNextPage, error } = useFileDecoder(fileId);

  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
  });

  const virtualItems = virtualizer.getVirtualItems();
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= items.length - 10 && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, items.length, virtualItems]);

  const [before, after] =
    items.length > 0
      ? [
          notUndefined(virtualItems[0]).start -
            virtualizer.options.scrollMargin,
          virtualizer.getTotalSize() -
            notUndefined(virtualItems[virtualItems.length - 1]).end,
        ]
      : [0, 0];

  if (error) {
    return <FileLoadingError error={error} />;
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        paddingLeft: "1rem",
      }}
      ref={parentRef}
    >
      <Box
        sx={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <Box sx={{ height: `${before}px` }} />
        {virtualItems.map((virtualItem) => (
          <RowViewer
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            index={virtualItem.index}
            data={items[virtualItem.index]}
          />
        ))}
        <Box sx={{ height: `${after}px` }} />
      </Box>
    </Box>
  );
}
