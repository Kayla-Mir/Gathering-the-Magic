import { forwardRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { IconButton, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
import { fontSize } from "@mui/system";
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
    borderRadius: '17px',
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
// MUI color theme
// color theme for buttons
const theme = createTheme({
    palette: {
        primary: {
            main: '#b6b5c5',
            darker: '#b6b5c5',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
    },
});

// hover tooltip style
const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} placement="right" followCursor />
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
        setNameOfDeck();
    }, [JSON.stringify(inventory)]);

    const setNameOfDeck = () => {
        decks.map((deck) => {
            if (item.deck_id === deck.id) {
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

    const getStyle = () => {
        if (item.legality === 'legal') {
            return {color: 'black'};
        } else {
            return {color: 'red'};
        }
    }

    return (
        <>
            <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <HtmlTooltip title={<img className="hoverImg" src={item.img_url} alt={item.name} />}>
                    <TableCell sx={{ fontSize: '16px' }} style={getStyle()} onClick={handleOpenModal}>{item.name}</TableCell>
                </HtmlTooltip>
                <TableCell sx={{ fontSize: '16px' }} align="right">
                    {item.img_back_url ?
                        item.toughness_back ?
                            `${item.toughness} // ${item.toughness_back}`
                            :
                            item.toughness ?? '-'
                        :
                        item.toughness ?? '-'
                    }
                </TableCell>
                <TableCell sx={{ fontSize: '16px' }} align="right">{item.power ?
                    item.power_back ?
                        `${item.power} // ${item.power_back}`
                        :
                        item.power ?? '-'
                    :
                    item.power ?? '-'
                }
                </TableCell>
                <TableCell sx={{ fontSize: '16px' }} align="right">{item.cmc}</TableCell>
                <TableCell sx={{ fontSize: '15px' }} >{item.set}</TableCell>
                <TableCell sx={{ fontSize: '16px' }} >{item.color_identity.length === 0 ? '-' : item.color_identity}</TableCell>
                <TableCell sx={{ fontSize: '15px' }} >{item.type_line}</TableCell>
                <TableCell sx={{ fontSize: '15px' }} align="center">
                    {!item.deck_id ?
                        <ThemeProvider theme={theme}>
                            <Tooltip title="Add to Deck" placement="right">
                                <IconButton size="small" color="primary" onClick={handleOpenSelect} >
                                    <AddBoxIcon />
                                </IconButton>
                            </Tooltip>
                        </ThemeProvider>
                        :
                        <a>{deckNameForItem}</a>
                    }
                </TableCell>
                <TableCell sx={{ fontSize: '16px' }} align="center">
                    <ThemeProvider theme={theme}>
                        <Tooltip title="Delete" placement="right">
                            <IconButton size="small" color="error" onClick={deleteFromInventory} >
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </ThemeProvider>
                </TableCell>

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
                                <div className="detailsContainerInv">
                                    <h3 className="cardDetails">Owned:
                                        {checkInventory() > 0 ?
                                            <span style={{ color: 'green', fontWeight: 'normal' }}> {checkInventory()}</span>
                                            :
                                            <span style={{ color: 'red', fontWeight: 'normal' }}> {checkInventory()}</span>
                                        }</h3>
                                    <h3 className="cardDetails">Type: <span style={{fontWeight: 'normal'}}>{item.type_line}</span></h3>
                                    <h3 className="cardDetails">Set: <span style={{fontWeight: 'normal'}}>{item.set}</span></h3>
                                    <h3 className="cardDetails">Commander Legality:
                                        {item?.legality === 'legal' ?
                                            <span style={{fontWeight: 'normal'}}> {item.legality}</span>
                                            :
                                            <span style={{ color: 'red', fontWeight: 'normal' }}> {item?.legality?.replace(/_/g, " ")}</span>
                                        }
                                    </h3>
                                    {item.deck_id ? <h3 className="cardDetails">In Deck: <span style={{fontWeight: 'normal'}}>{deckNameForItem}</span></h3> : null}
                                    
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
                        <InputLabel id="deckSelectLabel">Choose a Deck</InputLabel>
                        <Select
                            labelId="deckSelectLabel"
                            id="deckSelect"
                            value={deckIdToSend}
                            onChange={(event) => setDeckToSend(event.target.value)}
                            label="Decks"
                            sx={{ minWidth: 100, marginBottom: '10px' }}
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
                        <div style={{marginTop: '10px'}}>
                            <ThemeProvider theme={theme}>
                                <Tooltip title="Add to Deck" placement="bottom">
                                    <IconButton size="small" color="success" sx={{marginRight: '20px'}} onClick={inventoryCardAddToDeck} >
                                        <CheckIcon />
                                    </IconButton>
                                </Tooltip>
                            </ThemeProvider>
                            <ThemeProvider theme={theme}>
                                <Tooltip title="Cancel" placement="bottom">
                                    <IconButton size="small" color="error" onClick={handleCloseSelect} >
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </ThemeProvider>
                        </div>
                    </Box>
                </div>
            </Modal>
        </>
    )
}

export default InventoryItem;