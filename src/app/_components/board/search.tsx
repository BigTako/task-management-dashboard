'use client';

import { useCallback, useState } from 'react';
import { useSearchUrl } from '../_hooks';

export function BoardSearch() {
  const { getParam, setParam } = useSearchUrl();
  const [boardId, setBoardId] = useState(getParam('board'));
  const seachBoardId = getParam('board') ?? '';

  const handleSearch = useCallback(() => {
    setParam('board', boardId);
  }, [boardId, setParam]);

  return (
    <div className="flex gap-4">
      <div className="bg-avocado-light  w-full rounded-[20px] p-3 text-inherit">
        <input
          className="bg-avocado-light h-full w-full outline-none"
          defaultValue={seachBoardId}
          onChange={e => setBoardId(e.target.value)}
        />
      </div>
      <button className="bg-avocado-light rounded-[20px] px-3 font-bold text-inherit" onClick={handleSearch}>
        Load
      </button>
    </div>
  );
}
