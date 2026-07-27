"use client";

import { useCallback, useMemo, useState } from "react";
import type { EstimateKind } from "@/lib/estimators/types";

/** Track which keys the user has edited so badges flip to "Your input". */
export function useEditableNumbers<T extends Record<string, number>>(defaults: T) {
  const [values, setValues] = useState<T>(defaults);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const set = useCallback(<K extends keyof T>(key: K, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(defaults);
    setTouched({});
  }, [defaults]);

  const kindOf = useCallback(
    (key: keyof T, base: EstimateKind = "estimate"): EstimateKind =>
      touched[key] ? "user" : base,
    [touched],
  );

  return { values, set, reset, kindOf, touched };
}

export function useToggleSet(initial: string[]) {
  const [active, setActive] = useState(() => new Set(initial));

  const toggle = useCallback((id: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const reset = useCallback((ids: string[]) => {
    setActive(new Set(ids));
  }, []);

  const activeList = useMemo(() => [...active], [active]);

  return { active, activeList, toggle, reset };
}
