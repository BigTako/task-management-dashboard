import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useSearchUrl() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { replace } = router as { replace: (value: string) => void };
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
