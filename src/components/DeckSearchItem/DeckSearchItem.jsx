import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
// MUI imports
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Button, IconButton, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// imported styles
import './DeckSearchItem.css';

// MUI item height for menu
const ITEM_HEIGHT = 48;
// MUI color theme
// color theme for buttons
const theme = createTheme({
    palette: {
        primary: {
            main: '#55476f',
            darker: '#41335c',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
    },
});

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
    // MUI menu stuff
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
        handleClose();
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
        handleClose();
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
                    {frontSide ?
                        <div className="deckSearchDiv">
                            <ImageListItem key={item.id}>
                                <img className="searchFlipImg" src={item.card_faces[0].image_uris.normal} alt={item.name} />
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
                                <img className="searchFlipImg" src={item.card_faces[1].image_uris.normal} alt={item.name} />
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
                    <img className="searchImg" src={item.image_uris.normal} alt={item.name} />
                </>
            }
            <br />
            {
                user.id &&
                <div className="addToBtns">
                    <IconButton
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{
                            float: 'left',
                            marginLeft: '40px',
                            padding: '0px',
                        }}
                    >
                        <AddBoxIcon sx={{ fontSize: 35 }} />
                    </IconButton>
                    <Menu
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                        {cardOwned === true ?
                            <MenuItem>
                                <a onClick={addCardFromInventory}>Add From Inventory</a>
                            </MenuItem>
                            :
                            <MenuItem disabled>
                                <a onClick={addCardFromInventory}>Add From Inventory</a>
                            </MenuItem>
                        }
                        <MenuItem>
                            <a onClick={addToDeck}>Add to Deck</a>
                        </MenuItem>
                    </Menu>
                    <ThemeProvider theme={theme}>
                        <Button variant="contained" size="small" sx={{ float: 'right', marginRight: '40px' }} onClick={updateCommander}>Set as Commander</Button>
                    </ThemeProvider>
                </div>
            }
        </div >
    )
}

export default DeckSearchItem;