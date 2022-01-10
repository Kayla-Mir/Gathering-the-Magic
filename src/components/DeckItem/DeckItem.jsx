import { useEffect, useState } from "react";
import './DeckItem.css';

//modal settings
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// grid settings
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

// modal style
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

// TODO check if reducer has card clicked on and render based on that not DB res

function DeckItem({ item }) {
    const dispatch = useDispatch();
    const params = useParams();
    const inventory = useSelector((store) => store.setInventory);
    const [frontSide, setFrontSide] = useState(true);

    // modal settings
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        console.log('cardToCheckId', item.id)
        setOpen(true);
        // call check inventory function
    };
    const handleClose = () => {
        setOpen(false);
    };

    const flipImage = () => {
        setFrontSide(!frontSide);
    }

    const deleteFromDeck = () => {
        dispatch({
            type: 'DELETE_FROM_DECK',
            payload: {
                cardToDelete: item,
                deck_id: params.id
            }
        })
        handleClose();
    }

    const checkInventory = () => {
        // loop through inventory reducer
            // at each point check object key of scryfall id vs id of modal card
            // then store every time the id matches in a variable
            // then return that variable after done looping
        let count = 0;
        inventory.map((card) => {
            if (card.scryfall_id === item.id) {
                count += 1;
            }
        })
        return (count)
    }

    console.log('item', item);

    return (
        <>
            <div className={item.legalities.commander === 'legal' ? "deckResults" : "illegalCard"}>
                {!item.image_uris ?
                    <>
                        {frontSide ?
                            <img onClick={handleOpen} className="deckImgList" src={item.card_faces[0].image_uris.normal} alt={item.name} />
                            :
                            <img onClick={handleOpen} className="deckImgList" src={item.card_faces[1].image_uris.normal} alt={item.name} />
                        }
                        <br />
                        <button onClick={flipImage}>Flip</button>
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
                                            <img className="deckImg" src={item.card_faces[0].image_uris.normal} alt={item.name} />
                                            :
                                            <img className="deckImg" src={item.card_faces[1].image_uris.normal} alt={item.name} />
                                        }
                                        <br />
                                        <button onClick={flipImage}>Flip</button>
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
                                        }</h5>
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
                                    <button className="modalDltBtn" onClick={deleteFromDeck}>Delete</button>
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