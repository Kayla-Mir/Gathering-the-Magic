import { forwardRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import toast from 'react-hot-toast';
// imported styles
import './InventoryItem.css'
// table settings
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
//modal settings
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// hover settings
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
// select settings
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// toast settings
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// grid settings
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
// grid item
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
// modal style
const modalStyle = {
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

// box style
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 'auto',
    textAlign: 'center',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
};

// hover tooltip style
const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} placement="right" />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 320,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
        borderRadius: '17px'
    },
}));

// toast alert
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function InventoryItem({ item }) {
    const decks = useSelector((store) => store.setDeck);
    const [frontSide, setFrontSide] = useState(true);
    const [deckNameForItem, setDeckNameForItem] = useState('');
    const dispatch = useDispatch();
    const [deckIdToSend, setDeckIdToSend] = useState('');
    const [deckNameToSend, setDeckNameToSend] = useState('');
    const inventory = useSelector((store) => store.setInventory);
    //modal select settings
    const [openSelect, setOpenSelect] = useState(false);
    const handleOpenSelect = () => setOpenSelect(true);
    const handleCloseSelect = () => {
        setDeckIdToSend('');
        setOpenSelect(false);
    }
    // openModal settings
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    // toast settings
    const [openToast, setOpenToast] = useState(false);

    const handleClick = () => {
        setOpenToast(true);
    };
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };
    // regular stuff
    const flipImage = () => {
        setFrontSide(!frontSide);
    }

    useEffect(() => {
        setNameOfDeck()
    }, [JSON.stringify(inventory)])

    const setNameOfDeck = () => {
        decks.map((deck) => {
            if (item.deck_id === deck.id) {
                console.log('this is a matching deck', deck)
                setDeckNameForItem(deck.deck_name);
            }
        })
        
    }

    const deleteFromInventory = () => {
        dispatch({
            type: 'DELETE_FROM_INVENTORY',
            payload: item
        })
        handleCloseModal();
    }

    const setDeckToSend = (deckId) => {
        setDeckIdToSend(deckId);
        decks.map((deck) => {
            if (deck.id === deckId) {
                setDeckNameToSend(deck.deck_name);
            }
        })
    }

    const inventoryCardAddToDeck = () => {
        handleClick();
        handleCloseSelect();
        dispatch({
            type: 'UPDATE_DECK_CONTENTS',
            payload: {
                deck_id: deckIdToSend,
                deck_name: deckNameToSend,
                cardToAdd: {
                    id: item.scryfall_id,
                    name: item.name,
                    inventoryId: item.id
                }
            }
        })
        handleCloseModal();
    }

    const checkInventory = () => {
        let count = 0;
        inventory.map((card) => {
            if (card.scryfall_id === item.scryfall_id) {
                count += 1;
            }
        })
        return (count)
    }

    return (
        <>
            <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <HtmlTooltip title={<img className="hoverImg" src={item.img_url} alt={item.name} />}>
                    <TableCell onClick={handleOpenModal}>{item.name}</TableCell>
                </HtmlTooltip>
                <TableCell align="right">
                    {item.img_back_url ?
                        item.toughness_back ?
                            `${item.toughness} // ${item.toughness_back}`
                            :
                            item.toughness ?? '-'
                        :
                        item.toughness ?? '-'
                    }
                </TableCell>
                <TableCell align="right">{item.power ?
                    item.power_back ?
                        `${item.power} // ${item.power_back}`
                        :
                        item.power ?? '-'
                    :
                    item.power ?? '-'
                }
                </TableCell>
                <TableCell align="right">{item.cmc}</TableCell>
                <TableCell >{item.set}</TableCell>
                <TableCell >{item.color_identity.length === 0 ? '-' : item.color_identity}</TableCell>
                <TableCell >{item.type_line}</TableCell>
                <TableCell align="center">
                    {!item.deck_id ? <button onClick={handleOpenSelect}>Add</button> : <p>{deckNameForItem}</p>}
                </TableCell>
                <TableCell align="right"><button onClick={deleteFromInventory}>Delete</button></TableCell>

            </TableRow>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="inventoryItemDiv">
                    <Box sx={modalStyle}>
                        <Grid container spacing={4} columns={8}>
                            <Grid item xs={8}>
                                <h3 className="deckImgName">{item.name}</h3>
                            </Grid>
                            <Grid item xs={4}>
                                {item.img_back_url ?
                                    <>
                                        {frontSide ?
                                            <div className="deckItemDiv">
                                                <ImageListItem key={item.id}>
                                                    <img
                                                        className="modalImg"
                                                        src={!item.name ?
                                                            item.deck_img
                                                            :
                                                            item.img_url
                                                        }
                                                        alt={item.name}
                                                    />
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
                                                    <img className="modalImg" src={!item.name ? details.deck_img : item?.img_back_url} alt={item.name} />
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
                                        <img className="modalImg" src={!item.name ? details.deck_img : item?.img_url} alt={item.name} />
                                    </>
                                }
                            </Grid>
                            <Grid item xs={4}>
                                <div className="detailsContainer">
                                    <h5 className="cardDetails">Owned:
                                        {checkInventory() > 0 ?
                                            <span style={{ color: 'green' }}> {checkInventory()}</span>
                                            :
                                            <span style={{ color: 'red' }}> {checkInventory()}</span>
                                        }</h5>
                                    <h5 className="cardDetails">Type: {item.type_line}</h5>
                                    <h5 className="cardDetails">Set: {item.set}</h5>
                                    <h5 className="cardDetails">Commander Legality:
                                        {item?.legality === 'legal' ?
                                            <span> {item.legality}</span>
                                            :
                                            <span style={{ color: 'red' }}> {item?.legality?.replace(/_/g, " ")}</span>
                                        }
                                    </h5>
                                    <button onClick={handleOpenSelect}>Add</button>
                                    <button onClick={deleteFromInventory}>Delete</button>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </Modal>
            <Modal
                open={openSelect}
                onClose={handleCloseSelect}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    <Box sx={style}>
                        <p>Add {item.name} to which deck?</p>
                        <InputLabel id="deckSelectLabel">Choose Deck</InputLabel>
                        <Select
                            labelId="deckSelectLabel"
                            id="deckSelect"
                            value={deckIdToSend}
                            onChange={(event) => setDeckToSend(event.target.value)}
                            autoWidth
                            label="Deck"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {decks?.map((deck, i) => {
                                return (
                                    <MenuItem key={i} value={deck.id}>
                                        {deck.deck_name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                        <br />
                        <button onClick={inventoryCardAddToDeck}>Add Card</button>
                        <button onClick={handleCloseSelect}>Cancel</button>

                    </Box>
                </div>
            </Modal>
            {/* <>
                <Stack spacing={2} sx={{ width: '100%' }}>
                    <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast}>
                        <Alert onClose={handleCloseToast} severity="success" sx={{ width: '20vw'}}>
                            You have deleted a card!
                        </Alert>
                    </Snackbar>
                </Stack>
            </> */}
        </>
    )
}

export default InventoryItem;