import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
// imported styles
import './DeckItem.css';
// modal settings
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// grid settings
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
// modal style sheet
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
// grid item
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function DeckItem({ item }) {
    const dispatch = useDispatch();
    const params = useParams();
    // stores
    const inventory = useSelector((store) => store.setInventory);
    const details = useSelector((store) => store.setDetails);
    const cardsToExport = useSelector((store) => store.setExport);
    // general pieces of state
    const [frontSide, setFrontSide] = useState(true);
    // modal settings
    const [open, setOpen] = useState(false);
    // opens modal
    const handleOpen = () => {
        setOpen(true);
    };
    // closes modal
    const handleClose = () => {
        setOpen(false);
    };
    // loads the export reducer on page load
        //page load checks the search results comparing to inventory
    useEffect(() => {
        // handleRefresh(),
        cardReducer();
    }, [JSON.stringify(details.deck_contents.data)])
    // flips the image based on piece of state
    const flipImage = () => {
        setFrontSide(!frontSide);
    }
    // deletes card from deck based on params
    const deleteFromDeck = () => {
        dispatch({
            type: 'DELETE_FROM_DECK',
            payload: {
                cardToDelete: item,
                deck_id: params.id,
                deck_name: details.deck_name
            }
        })
        handleClose();
    }
    // check inventory for deleted card then update in inventory
    const updateInventory = () => {
        inventory.map((card) => {
            if (card.deck_id == params.id && card.scryfall_id === item.id) {
                dispatch({
                    type: 'UPDATE_INVENTORY_CARD_DELETE',
                    payload: {
                        card_id: card.id,
                    }
                })
            } 
        })
        deleteFromDeck();
    }
    // checks the inventory vs the card prop and increments count to be displayed
    const checkInventory = () => {
        let count = 0;
        inventory.map((card) => {
            if (card.scryfall_id === item.id) {
                count += 1;
            }
        })
        return count;
    }

    const countCardsAvailable = () => {
        let countAvailable = 0;
        inventory.map((card) => {
            if (card.scryfall_id === item.id && card.deck_id === null) {
                countAvailable += 1;
            }
        })
        return countAvailable;
    }

    const isCardInDeck = () => {
        let available = 0;
        inventory.map((card) => {
            if (card.scryfall_id === item.id && card.deck_id == params.id) {
                available += 1;
            }   
        })
        return available;
    }

    const cardReducer = () => {
        let countAvailable = countCardsAvailable();
        if (countAvailable === 0 && cardsToExport.length < 1) {
            if (item.type_line.indexOf('Basic') === -1) {
                dispatch({
                    type: 'ADD_TO_EXPORT',
                    payload: item.name
                })
            }
        }
    }

    return (
        <>
            <div className={item.legalities.commander === 'legal' ? "deckResults" : "illegalCard"}>
                {!item.image_uris ?
                    <>
                        {frontSide ?
                            <div className="deckItemDiv">
                                <ImageListItem key={item.id}>
                                    <img onClick={handleOpen} className="deckImgList" src={item.card_faces[0].image_uris.normal} alt={item.name} />
                                    <ImageListItemBar
                                        title={item.name}
                                        sx={{
                                            backgroundColor: 'grey',
                                            opacity: 1,
                                            width: 0,
                                            top: '-61%',
                                            left: '63%'
                                        }}
                                        actionIcon={
                                            <IconButton onClick={flipImage}>
                                                <AutorenewIcon
                                                    fontSize="large"
                                                    className="deckItemBtn"
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
                                    <img onClick={handleOpen} className="deckImgList" src={item.card_faces[1].image_uris.normal} alt={item.name} />
                                    <ImageListItemBar
                                        title={item.name}
                                        sx={{
                                            backgroundColor: 'grey',
                                            opacity: 1,
                                            width: 0,
                                            top: '-61%',
                                            left: '63%'
                                        }}
                                        actionIcon={
                                            <IconButton onClick={flipImage}>
                                                <AutorenewIcon
                                                    fontSize="large"
                                                    className="deckItemBtn"
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
                        <img onClick={handleOpen} className="deckImgList" src={item.image_uris.normal} alt={item.name} />
                    </>
                }
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    <Box sx={style}>
                        <Grid container spacing={4} columns={16}>
                            <Grid item xs={16}>
                                <h3 className="deckImgName">{item.name}</h3>
                            </Grid>
                            <Grid item xs={8}>
                                {!item.image_uris ?
                                    <>
                                        {frontSide ?
                                            <div className="deckItemDiv">
                                                <ImageListItem key={item.id}>
                                                    <img className="deckImg" src={item.card_faces[0].image_uris.normal} alt={item.name} />
                                                    <ImageListItemBar
                                                        title={item.name}
                                                        sx={{
                                                            backgroundColor: 'grey',
                                                            opacity: 1,
                                                            width: 0,
                                                            top: '-61%',
                                                            left: '80%'
                                                        }}
                                                        actionIcon={
                                                            <IconButton onClick={flipImage}>
                                                                <AutorenewIcon
                                                                    fontSize="large"
                                                                    className="deckItemBtn"
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
                                                    <img className="deckImg" src={item.card_faces[1].image_uris.normal} alt={item.name} />
                                                    <ImageListItemBar
                                                        title={item.name}
                                                        sx={{
                                                            backgroundColor: 'grey',
                                                            opacity: 1,
                                                            width: 0,
                                                            top: '-61%',
                                                            left: '80%'
                                                        }}
                                                        actionIcon={
                                                            <IconButton onClick={flipImage}>
                                                                <AutorenewIcon
                                                                    fontSize="large"
                                                                    className="deckItemBtn"
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
                                        <img className="deckImg" src={item.image_uris.normal} alt={item.name} />
                                    </>
                                }
                            </Grid>
                            <Grid item xs={8}>
                                <div className="detailsContainer">
                                    <h5 className="cardDetails">Owned:
                                        {checkInventory() > 0 ?
                                            <span style={{ color: 'green' }}> {checkInventory()}</span>
                                            :
                                            <span style={{ color: 'red' }}> {checkInventory()}</span>
                                        }
                                    </h5>
                                    <h5 className="cardDetails">Available:
                                        {countCardsAvailable() > 0 ?
                                            <span style={{ color: 'green' }}> {countCardsAvailable()}</span>
                                            :
                                            <span style={{ color: 'red' }}> {countCardsAvailable()}</span>
                                        }
                                    </h5>
                                    <h5 className="cardDetails">Added from Inventory? {isCardInDeck() > 0 ? <span style={{ color: 'green' }}> ✅ </span> : <span style={{ color: 'red' }}> ❌ </span>}</h5>
                                    <h5 className="cardDetails">Type: {item.type_line}</h5>
                                    <h5 className="cardDetails">Set: {item.set_name}</h5>
                                    <h5 className="cardDetails">Commander Legality:
                                        {item.legalities.commander === 'legal' ?
                                            <span> {item.legalities.commander}</span>
                                            :
                                            <span style={{ color: 'red' }}> {item.legalities.commander.replace(/_/g, " ")}</span>
                                        }
                                    </h5>
                                    <h5 className="cardDetails">Prices:
                                        <p className="cardDetails">Normal: ${item.prices.usd !== null ? item.prices.usd : '---'}</p>
                                        <p className="cardDetails">Foil: ${item.prices.usd_foil !== null ? item.prices.usd_foil : '---'}</p>
                                    </h5>
                                    <br />
                                    <button className="modalDltBtn" onClick={updateInventory}>Delete</button>
                                </div>

                            </Grid>

                        </Grid>
                    </Box>
                </div>
            </Modal>

        </>
    )
}

export default DeckItem;