'use client';

import { useCallback, useState } from 'react';
import { useSearchUrl } from '../_hooks';

export function BoardSearch() {
  const { getParam, setParam } = useSearchUrl();
  const [boardId, setBoardId] = useState(getParam('board'));
  const seachBoardId = getParam('board') ?? '';

  const handleSearch = useCallback(() => {
    setParam('board', boardId);
  }, [boardId]);

  return (
    <div className="flex gap-4">
      <div className="text-inherit  w-full rounded-[20px] bg-avocado-light p-3">
        <input
          className="h-full w-full bg-avocado-light outline-none"
          defaultValue={seachBoardId}
          onChange={e => setBoardId(e.target.value)}
        />
      </div>
      <button className="text-inherit rounded-[20px] bg-avocado-light px-3 font-bold" onClick={handleSearch}>
        Load
      </button>
    </div>
  );
}
