import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { IconButton, ImageListItem, ImageListItemBar, Tooltip } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
    borderRadius: '17px',
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
// MUI color theme
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
        let countAvailable = isCardInDeck();
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
            <div onClick={handleOpen} className={item.legalities.commander === 'legal' ? "deckResults" : "illegalCard"}>
                {!item.image_uris ?
                    <>
                        {frontSide ?
                            <div className="deckItemDiv">
                                <ImageListItem key={item.id}>
                                    <img  className="deckImgList" src={item.card_faces[0].image_uris.normal} alt={item.name} />
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
                            <Grid item xs={8}>
                                {!item.image_uris ?
                                    <>
                                        {frontSide ?
                                            <div className="deckItemDiv">
                                                <ImageListItem key={item.id}>
                                                    <img className="deckModalImg" src={item.card_faces[0].image_uris.normal} alt={item.name} />
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
                                                    <img className="deckModalImg" src={item.card_faces[1].image_uris.normal} alt={item.name} />
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
                                        <img className="deckModalImg" src={item.image_uris.normal} alt={item.name} />
                                    </>
                                }
                            </Grid>
                            <Grid item xs={8}>
                                <div className="detailsContainerDI">
                                    <h3 className="cardDetails">Owned:
                                        {checkInventory() > 0 ?
                                            <span style={{ color: 'green', fontWeight: 'normal' }}> {checkInventory()}</span>
                                            :
                                            <span style={{ color: 'red', fontWeight: 'normal' }}> {checkInventory()}</span>
                                        }
                                    </h3>
                                    <h3 className="cardDetails">Available:
                                        {countCardsAvailable() > 0 ?
                                            <span style={{ color: 'green', fontWeight: 'normal' }}> {countCardsAvailable()}</span>
                                            :
                                            <span style={{ color: 'red', fontWeight: 'normal' }}> {countCardsAvailable()}</span>
                                        }
                                    </h3>
                                    <h3 className="cardDetails">In Deck:
                                        {isCardInDeck() > 0 ?
                                            <span style={{ color: 'green', fontWeight: 'normal' }}> ✅</span>
                                            :
                                            <span style={{ color: 'red', fontWeight: 'normal' }}> ❌</span>
                                        }
                                    </h3>
                                    <h3 className="cardDetails">Type: <span style={{ fontWeight: 'normal' }}>{item.type_line}</span></h3>
                                    <h3 className="cardDetails">Set: <span style={{ fontWeight: 'normal' }}>{item.set_name}</span></h3>
                                    <h3 className="cardDetails">Commander Legality:
                                        {item.legalities.commander === 'legal' ?
                                            <span style={{ fontWeight: 'normal' }}> {item.legalities.commander}</span>
                                            :
                                            <span style={{ color: 'red', fontWeight: 'normal' }}> {item.legalities.commander.replace(/_/g, " ")}</span>
                                        }
                                    </h3>
                                    <h3 className="cardDetails">Prices:
                                        <p className="cardDetails">Normal: <span style={{ fontWeight: 'normal' }}>${item.prices.usd !== null ? item.prices.usd : '---'}</span></p>
                                        <p className="cardDetails">Foil: <span style={{ fontWeight: 'normal' }}>${item.prices.usd_foil !== null ? item.prices.usd_foil : '---'}</span></p>
                                    </h3>                                <ThemeProvider theme={theme}>
                                    <Tooltip title="Delete From Deck" placement="right">
                                        <IconButton className="modalDltBtn" color="error">
                                            <DeleteForeverIcon sx={{ fontSize: 35 }} onClick={updateInventory} />
                                        </IconButton>
                                    </Tooltip>
                                </ThemeProvider>
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