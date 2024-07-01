import { useMemo } from "react";
import JsonView from "react18-json-view";
import { atom, useAtom } from "jotai";
import { collapsedRowsAtom } from "./state";
import { jsonSummary } from "./RowContent.utils";
import "react18-json-view/src/style.css";

export interface RowContentProps {
  index: number;
  data: unknown;
}

export function RowContent({ index, data }: RowContentProps) {
  const rowAtom = useMemo(
    () =>
      atom(
        (get) => get(collapsedRowsAtom).get(index) ?? false,
        (get, set, newValue: boolean) =>
          set(
            collapsedRowsAtom,
            new Map(get(collapsedRowsAtom)).set(index, newValue)
          )
      ),
    [index]
  );
  const [isCollapsed, setIsCollapsed] = useAtom(rowAtom);

  if (isCollapsed) {
    return (
      <JsonView
        src={data}
        collapsed={10}
        onCollapse={({ isCollapsing }) => {
          if (!isCollapsing) {
            setIsCollapsed(false);
          }
        }}
        theme="default"
      />
    );
  }

  return (
    <>
      <code
        className="json-view"
        style={{ width: "100%", cursor: "pointer" }}
        onClick={() => setIsCollapsed(true)}
      >
        <span>&#123;</span>
        <button className="jv-button">{jsonSummary(data)}</button>
        <span>&#125;</span>
      </code>
    </>
  );
}
