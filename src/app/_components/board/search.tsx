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
      <div className="h-[40px] w-full rounded-[20px] bg-green-300 text-black">
        <input
          className="h-full w-full outline-none"
          defaultValue={seachBoardId}
          onChange={e => setBoardId(e.target.value)}
        />
      </div>
      <button className="rounded-[20px] bg-green-300 px-3 text-black" onClick={handleSearch}>
        Load
      </button>
    </div>
  );
}
