import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function LogOutButton(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const clearUserFields = () => {
    dispatch({ type: 'LOGOUT' });
    dispatch({ type: 'CLEAR_SEARCH' });
    dispatch({ type: 'CLEAR_DECK' });
    dispatch({ type: 'CLEAR_DETAILS' });
    dispatch({ type: 'CLEAR_COMMANDER' });
    history.push('/login');
  }

  return (
    <button
      // This button shows up in multiple locations and is styled differently
      // because it's styled differently depending on where it is used, the className
      // is passed to it from it's parents through React props
      className={props.className}
      onClick={clearUserFields}
      style={{marginRight: '20px'}}
    >
      Log Out
    </button>
  );
}

export default LogOutButton;
