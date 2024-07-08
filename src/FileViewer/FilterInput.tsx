import { useAtom } from "jotai";
import { filterAtom } from "./state";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import { IconButton, Input } from "@mui/joy";
import { useState } from "react";
import { FilterHintModal } from "./FilterHintModal";

export function FilterInput() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useAtom(filterAtom);

  return (
    <>
      <Input
        sx={{ width: "100%" }}
        startDecorator={<MagnifyingGlassIcon />}
        placeholder="JSONPath filter... $[?(@root.id > 32)]"
        type="text"
        value={search ?? ""}
        onChange={(e) => setSearch(e.target.value)}
        endDecorator={
          <IconButton variant="soft" onClick={() => setOpen(true)}>
            <InformationCircleIcon />
          </IconButton>
        }
      ></Input>
      <FilterHintModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
