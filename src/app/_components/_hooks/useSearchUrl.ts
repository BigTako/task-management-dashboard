'use client';

import { usePathname, useSearchParams } from 'next/navigation';
// import Router from "next/router";
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useSearchUrl() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const getParam = useCallback((param: string) => searchParams.get(param), [searchParams]);
  const setParam = useCallback(
    (param: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(param, value);
      } else {
        params.delete(param);
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams],
  );
  return { getParam, setParam };
}
