import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

function DeckSearchItem({ item }) {
    const [frontSide, setFrontSide] = useState(true);
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const params = useParams();

    const flipImage = () => {
        setFrontSide(!frontSide);
    }

    const addToDeck = () => {
        dispatch({
            type: 'UPDATE_DECK_CONTENTS',
            payload: {
                cardToAdd: item,
                deck_id: Number(params.id)
            }
        })
    }

    const updateCommander = () => {
        dispatch({
            type: 'UPDATE_DECK_COMMANDER',
            payload: {
                commander: item.name,
                deck_img: item.image_uris?.normal ?? item.card_faces[0]?.image_uris?.normal,
                deck_id: Number(params.id)
            }
        })
    }

    return (
        <div className="results">
            {!item.image_uris ?
                <>
                    <p>{item.name}</p>
                    {frontSide ?
                        <img src={item.card_faces[0].image_uris.normal} alt={item.name} />
                        :
                        <img src={item.card_faces[1].image_uris.normal} alt={item.name} />
                    }
                    <br />
                    <button onClick={flipImage}>Flip</button>
                </>
                :
                <>
                    <p>{item.name}</p>
                    <img src={item.image_uris.normal} alt={item.name} />
                </>
            }
            <br />
            {user.id && 
            <>
                <button onClick={addToDeck}>Add to Deck</button>
                <button onClick={updateCommander}>Set as Commander</button>
            </>
            }

        </div>
    )
}

export default DeckSearchItem;