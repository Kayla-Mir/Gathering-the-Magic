import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// This is one of our simplest components
// It doesn't have local state
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is

function InfoPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  return (
    <div className="container">
      <p>Info Page</p>
    </div>
  );
}

export default InfoPage;
