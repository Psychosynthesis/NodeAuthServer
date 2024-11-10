// import { useEffect, useState } from 'react';
import { useCommonStore } from '@Store';

// import './style.scss';

interface ListPageProps {
}

export const List = () => {
  const [state, dispatch] = useCommonStore();

  return (
    <div className="list">
      <h2 style={{ textAlign: 'center' }}>List</h2>

    </div>
  );
}
