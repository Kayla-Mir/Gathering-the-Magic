import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import './SearchItem.css'

function SearchItem({ item }) {
    const [frontSide, setFrontSide] = useState(true);
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();

    const flipImage = () => {
        setFrontSide(!frontSide);
    }

    const addToInventory = () => {
        let cardToAdd = {
            img_url: item.image_uris?.normal ?? item.card_faces[0]?.image_uris?.normal,
            img_back_url: null,
            name: item.name,
            toughness: item.toughness ?? null,
            toughness_back: null,
            power: item.power ?? null,
            power_back: null,
            cmc: item.cmc,
            set: item.set,
            color_identity: item.color_identity,
            type_line: item.type_line,
            legality: item.legalities.commander,
            scryfall_id: item.id,
        }
        if (!item.image_uris) {
            cardToAdd = {
                ...cardToAdd, 
                img_back_url: item.card_faces[1].image_uris.normal,
            }
        }
        if (item.card_faces) {
            cardToAdd = {
                ...cardToAdd,
                toughness: item.card_faces[0]?.toughness,
                toughness_back: item.card_faces[1]?.toughness,
                power: item.card_faces[0]?.power,
                power_back: item.card_faces[1]?.power,
            }
        }
        dispatch({
            type: 'ADD_TO_INVENTORY',
            payload: cardToAdd
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
            {user.id && <button onClick={addToInventory}>Add to Inventory</button>}
            
        </div>
    )
}

export default SearchItem;