import { useState } from "react";
import './DeckItem.css';

function DeckItem({item}) {
    const [frontSide, setFrontSide] = useState(true);
    
    return (
        <div className="deckResults">
            {!item.image_uris ?
                <>
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
                    <img src={item.image_uris.normal} alt={item.name} />
                </>
            }
        </div>
    )
}

export default DeckItem;