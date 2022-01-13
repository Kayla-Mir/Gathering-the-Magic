import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import './DeckPage.css';

function DeckPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    // store imports
    const decks = useSelector((store) => store.setDeck);
    // on page load fetches all the decks currently owned by the user and displays the deck_img
    useEffect(() => {
        dispatch({ type: 'FETCH_DECK' });
        dispatch({ type: 'FETCH_INVENTORY' });
    }, [])
    // creates a new deck with untitled as a name and placeholder image
    const createDeck = () => {
        dispatch({
            type: 'NEW_DECK',
            payload: { deck_name: 'untitled' }
        })
    }


    return (
        <div className="deckPage">
            <div className="deckBtnDiv">
                <button className="newDeckBtn" onClick={createDeck}>New Deck</button>
            </div>
            {decks?.length > 0 && decks?.map((deck) => {
                return (
                    <div className="deckDiv" key={deck.id}>
                        <h3>{deck.deck_name}</h3>
                        <img
                            className="commanderImg"
                            onClick={() => history.push(`/deckView/${deck.id}`)}
                            src={deck.deck_img}
                            alt={deck.commander}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default DeckPage;