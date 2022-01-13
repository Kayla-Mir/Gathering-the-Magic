import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
// imported styles
import './DeckSearchItem.css';

function DeckSearchItem({ item }) {
    const dispatch = useDispatch();
    const params = useParams();
    // pieces of state
    const [frontSide, setFrontSide] = useState(true);
    const [cardBeingAdded, setCardBeingAdded] = useState({});
    const [cardOwned, setCardOwned] = useState(false);
    // imported stores
    const user = useSelector((store) => store.user);
    const decks = useSelector((store) => store.setDeck);
    const inventory = useSelector((store) => store.setInventory);
    const details = useSelector((store) => store.setDetails);
    // handles the flipping of the image 
    const flipImage = () => {
        setFrontSide(!frontSide);
    }
    //page load checks the search results comparing to inventory
    useEffect(() => {
        // handleRefresh(),
        checkInventoryCards();
    }, [JSON.stringify(inventory)])
    // checks inventory availability of card
    const checkInventoryCards = () => {
        inventory.map((card) => {
            if (card.scryfall_id === item.id && !card.deck_id) {
                setCardOwned(true)
                setCardBeingAdded(card);
                return;
            }
        })
    }
    // adds a new card to the deck, sends the deck_id, 
    // deck_name, and the item to add  
    const addToDeck = () => {
        let deckNameToAdd;
        decks.map((deck) => {
            if (Number(params.id) === deck.id) {
                deckNameToAdd = deck.deck_name
            }
        })
        dispatch({
            type: 'UPDATE_DECK_CONTENTS',
            payload: {
                cardToAdd: item,
                deck_id: Number(params.id),
                deck_name: deckNameToAdd
            }
        })
    }
    const addCardFromInventory = () => {
        dispatch({
            type: 'UPDATE_DECK_CONTENTS',
            payload: {
                deck_id: Number(params.id),
                deck_name: details.deck_name,
                cardToAdd: {
                    id: cardBeingAdded.scryfall_id,
                    name: cardBeingAdded.name,
                    inventoryId: cardBeingAdded.id
                }
            }
        })
        setCardOwned(false);
    }
    // updates the commander of a deck, sends a new deck
    const updateCommander = () => {
        dispatch({
            type: 'UPDATE_DECK_COMMANDER',
            payload: {
                commander: item.name,
                deck_img: item.image_uris?.normal ?? item.card_faces[0]?.image_uris?.normal,
                deck_id: Number(params.id)
            }
        })
        dispatch({
            type: 'CLEAR_COMMANDER',
        })
    }
    return (
        <div className="results">
            {!item.image_uris ?
                <>
                    <p className="searchName">{item.name}</p>
                    {frontSide ?
                        <div className="deckSearchDiv">
                            <ImageListItem key={item.id}>
                                <img src={item.card_faces[0].image_uris.normal} alt={item.name} />
                                <ImageListItemBar
                                    title={item.name}
                                    sx={{
                                        backgroundColor: 'grey',
                                        opacity: 1,
                                        width: 0,
                                        top: '-60%',
                                        left: '67%'
                                    }}
                                    actionIcon={
                                        <IconButton onClick={flipImage}>
                                            <AutorenewIcon
                                                fontSize="large"
                                                className="deckSearchBtn"
                                                sx={{
                                                    color: 'white',
                                                    p: 2,
                                                }}
                                            />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        </div>
                        :
                        <div>
                            <ImageListItem key={item.id}>
                                <img src={item.card_faces[1].image_uris.normal} alt={item.name} />
                                <ImageListItemBar
                                    title={item.name}
                                    sx={{
                                        backgroundColor: 'grey',
                                        opacity: 1,
                                        width: 0,
                                        top: '-60%',
                                        left: '67%'
                                    }}
                                    actionIcon={
                                        <IconButton onClick={flipImage}>
                                            <AutorenewIcon
                                                fontSize="large"
                                                className="deckSearchBtn"
                                                sx={{
                                                    color: 'white',
                                                    p: 2,
                                                }}
                                            />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        </div>
                    }
                </>
                :
                <>
                    <p className="searchName">{item.name}</p>
                    <img className="searchImg" src={item.image_uris.normal} alt={item.name} />
                </>
            }
            <br />
            {
                user.id &&
                <div className="addToBtns">
                    {cardOwned === true ? <button onClick={addCardFromInventory}>Add From Inventory</button> : null}
                    <button onClick={addToDeck}>Add to Deck</button>
                    <button onClick={updateCommander}>Set as Commander</button>
                </div>
            }
        </div >
    )
}

export default DeckSearchItem;