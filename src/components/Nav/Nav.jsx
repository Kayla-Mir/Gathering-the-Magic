import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const clearUserFields = () => {
    dispatch({ type: 'CLEAR_SEARCH' });
    dispatch({ type: 'CLEAR_DETAILS' });
    dispatch({ type: 'CLEAR_COMMANDER' });
    dispatch({ type: 'CLEAR_EXPORT' });
  }

  return (
    <div className="nav">
      <Link onClick={clearUserFields} to="/home">
        <h2 className="nav-title"><img className='mtgSymbol' src='/image.png' /> Gathering the Magic</h2>
      </Link>
      <div>
        {/* <Link className="navLink" to="/home">
          Home
        </Link> */}

        <Link onClick={clearUserFields} className="navLink" to='/search'>
          Search
        </Link>

        {/* {user.id ?
          <Link onClick={clearUserFields} className="navLink" to="/deck">
            Your Decks
          </Link>
          :
          <Link onClick={clearUserFields} className="navLink" to="/deck">
            Make a Deck
          </Link>
        } */}

        {user.id &&
          <Link onClick={clearUserFields} className="navLink" to="/deck">
            Your Decks
          </Link>
        }

        {/* If no user is logged in, show these links */}
        {!user.id &&
          // If there's no user, show login/registration links
          <Link onClick={clearUserFields} className="navLink" to="/login">
            Login
          </Link>
        }

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link onClick={clearUserFields} className="navLink" to="/inventory">
              Inventory
            </Link>

            <LogOutButton className="navLink" />

            {/* <Link onClick={clearUserFields} className="navLink" to="/info">
              Info Page
            </Link> */}
          </>
        )}

        <Link onClick={clearUserFields} className="navLink" to="/about">
          About
        </Link>
      </div>
    </div>
  );
}

export default Nav;
