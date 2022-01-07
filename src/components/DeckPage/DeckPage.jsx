import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

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

    console.log('decks', decks)

    return (
        <>
            <div>
                <button onClick={createDeck}>New Deck</button>
            </div>
            {decks?.length > 0 && decks?.map((deck) => {
                return (
                    <div key={deck.id}>
                        <h3>{deck.deck_name}</h3>
                        <h4>Cards: {deck.deck_contents?.length + 1}</h4>
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