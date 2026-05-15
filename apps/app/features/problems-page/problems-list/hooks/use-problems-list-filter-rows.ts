import { useCallback, useMemo, useState } from "react";
import type { ProblemListFilterRow } from "../lib/types";
import { countActiveFilterRows } from "../utils/count-active-filter-rows";
import { createFilterRow } from "../utils/create-filter-row";

export function useProblemsListFilterRows() {
  const [rows, setRows] = useState<ProblemListFilterRow[]>(() => [
    createFilterRow(),
  ]);

  const activeCount = useMemo(() => countActiveFilterRows(rows), [rows]);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, createFilterRow()]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => {
      if (prev.length <= 1) {
        return [createFilterRow()];
      }
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const updateRow = useCallback(
    (id: string, patch: Partial<Omit<ProblemListFilterRow, "id">>) => {
      setRows((prev) =>
        prev.map((r) => {
          if (r.id !== id) {
            return r;
          }
          const next = { ...r, ...patch };
          if (patch.field !== undefined && patch.field !== r.field) {
            next.value = "";
          }
          return next;
        })
      );
    },
    []
  );

  const reset = useCallback(() => {
    setRows([createFilterRow()]);
  }, []);

  return {
    rows,
    setRows,
    addRow,
    removeRow,
    updateRow,
    reset,
    activeCount,
  };
}
