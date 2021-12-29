import { useState } from "react";
import { useDispatch } from "react-redux";

function InventoryItem({ item }) {
    const [frontSide, setFrontSide] = useState(true);
    const dispatch = useDispatch();

    const flipImage = () => {
        setFrontSide(!frontSide);
    }

    // const addToInventory = () => {
    //     let cardToAdd = {
    //         img_url: item.image_uris?.normal ?? item.card_faces[0]?.image_uris?.normal,
    //         img_back_url: null,
    //         name: item.name,
    //         toughness: item.toughness ?? null,
    //         toughness_back: null,
    //         power: item.power ?? null,
    //         power_back: null,
    //         cmc: item.cmc,
    //         set: item.set,
    //         color_identity: item.color_identity,
    //         type_line: item.type_line,
    //         legality: item.legalities.commander
    //     }
    //     if (!item.image_uris) {
    //         cardToAdd = {
    //             ...cardToAdd, 
    //             img_back_url: item.card_faces[1].image_uris.normal,
    //         }
    //     }
    //     if (item.card_faces) {
    //         cardToAdd = {
    //             ...cardToAdd,
    //             toughness: item.card_faces[0]?.toughness,
    //             toughness_back: item.card_faces[1]?.toughness,
    //             power: item.card_faces[0]?.power,
    //             power_back: item.card_faces[1]?.power,
    //         }
    //     }
    //     dispatch({
    //         type: 'ADD_TO_INVENTORY',
    //         payload: cardToAdd
    //     })
    // }

    return (
        <div className="results">
            {item.img_back_url !== null ?
                <>
                    <p>{item.name}</p>
                    {frontSide ?
                        <img src={item.img_url} alt={item.name} />
                        :
                        <img src={item.img_back_url} alt={item.name} />
                    }
                    <br />
                    <button onClick={flipImage}>Flip</button>
                </>
                :
                <>
                    <p>{item.name}</p>
                    <img src={item.img_url} alt={item.name} />
                </>
            }
        </div>
    )
}

export default InventoryItem;