import { atomWithReset } from "jotai/utils";

export const collapsedRowsAtom = atomWithReset(new Map<number, boolean>());
export const filterAtom = atomWithReset(null as string | null);