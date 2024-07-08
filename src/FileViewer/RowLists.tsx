import { useEffect, useRef } from "react";
import { useFileDecoder } from "./useFileDecoder";
import { notUndefined, useVirtualizer } from "@tanstack/react-virtual";
import { RowViewer } from "./RowViewer";
import { Box } from "@mui/joy";
import { FileLoadingError } from "./FileLoadingError";
import { RowListLoading } from "./RowListLoading";

export interface RowListsProps {
  fileId: number;
}

export function RowLists({ fileId }: RowListsProps) {
  const { items, hasNextPage, fetchNextPage, error, isLoading, cancel } =
    useFileDecoder(fileId);

  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: isLoading ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
  });

  const virtualItems = virtualizer.getVirtualItems();
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= items.length - 10 && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, items.length, virtualItems, isLoading]);

  const [before, after] =
    items.length > 0 && virtualItems.length > 0
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

  if (isLoading && items.length === 0) {
    return <RowListLoading onCancel={cancel} />;
  }
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        padding: "0 1rem",
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
            isLoading={isLoading && virtualItem.index === items.length}
          />
        ))}
        <Box sx={{ height: `${after}px` }} />
      </Box>
    </Box>
  );
}
