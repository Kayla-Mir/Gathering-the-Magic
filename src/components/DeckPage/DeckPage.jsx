import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import './DeckPage.css';

function DeckPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const decks = useSelector((store) => store.setDeck);

    useEffect(() => {
        dispatch({ type: 'FETCH_DECK' })
    }, [])

    const createDeck = () => {
        dispatch({
            type: 'NEW_DECK',
            payload: { deck_name: 'untitled' }
        })
    }



    return (
        <>
            <div className="deckBtnDiv">
                <button className="newDeckBtn" onClick={createDeck}>New Deck</button>
            </div>
            {decks?.length > 0 && decks?.map((deck) => {
                return (
                    <div className="deckDiv" key={deck.id}>
                        <h3>{deck.deck_name}</h3>
                        <img
                            onClick={() => history.push(`/deckView/${deck.id}`)}
                            src={deck.deck_img}
                            alt={deck.commander}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default DeckPage;