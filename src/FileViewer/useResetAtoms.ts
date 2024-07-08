import { useResetAtom } from "jotai/utils";
import { useCallback } from "react";
import { collapsedRowsAtom, filterAtom } from "./state";


export const useResetAtoms = () => {
    const reset = useResetAtom(collapsedRowsAtom);
    const resetFilter = useResetAtom(filterAtom);
    return useCallback(() => {
        reset();
        resetFilter();
    }, [reset, resetFilter]);
};
