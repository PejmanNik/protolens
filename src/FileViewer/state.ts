import { atomWithReset } from "jotai/utils";

export const collapsedRowsAtom = atomWithReset(new Map<number, boolean>());