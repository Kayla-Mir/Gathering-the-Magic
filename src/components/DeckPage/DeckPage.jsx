import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function DeckPage () {
    const dispatch = useDispatch();
    const history = useHistory();
    const decks = useSelector((store) => store.setDeck);

    useEffect(() => {
        dispatch({
            type: 'FETCH_DECK'
        })
    }, [])

    console.log('decks', decks)

    return (
        <>
            {decks?.length > 0 && decks?.map((deck) => {
                return (
                    <div key={deck.id}>
                        <p>{deck.deck_name}</p>
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