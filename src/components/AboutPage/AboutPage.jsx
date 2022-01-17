import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './AboutPage.css'

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  return (
    <div className="container">
      <div>
        <p style={{ textAlign: 'center' }}>This is a Card Catalog and Deck builder all in one app!</p>
      </div>

    </div>
  );
}

export default AboutPage;
