import { forwardRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
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
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

// toast alert
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function InventoryItem({ item }) {
    const decks = useSelector((store) => store.setDeck);
    const [frontSide, setFrontSide] = useState(true);
    const dispatch = useDispatch();
    const [deckIdToSend, setDeckIdToSend] = useState('');
    const [deckNameToSend, setDeckNameToSend] = useState('');

    // modal settings
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    //modal select settings
    const [openSelect, setOpenSelect] = useState(false);
    const handleOpenSelect = () => setOpenSelect(true);
    const handleCloseSelect = () => {
        setDeckIdToSend('');
        setOpenSelect(false);
    }

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

    const deleteFromInventory = () => {
        dispatch({
            type: 'DELETE_FROM_INVENTORY',
            payload: item
        })
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
                }
            }
        })
    }

    return (
        <>
            <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <HtmlTooltip title={<img src={item.img_url} alt={item.name} />}>
                    <TableCell onClick={handleOpen}>{item.name}</TableCell>
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
                    <button onClick={handleOpenSelect}>Add</button>
                </TableCell>
                <TableCell align="right"><button onClick={deleteFromInventory}>Delete</button></TableCell>

            </TableRow>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    <Box sx={style}>
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
                    <Snackbar open={openToast} autoHideDuration={49000000} onClose={handleCloseToast}>
                        <Alert onClose={handleCloseToast} severity="success" sx={{ width: '15vw', position: 'absolute', bottom: '-40vh', left: '40vw' }}>
                            This is a success message!
                        </Alert>
                    </Snackbar>
                </Stack>
            </> */}
        </>
    )
}

export default InventoryItem;