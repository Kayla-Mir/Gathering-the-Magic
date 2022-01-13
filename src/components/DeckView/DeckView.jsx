import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
// imported components
import LoadingComponent from "../Loading/Loading";
import DeckItem from "../DeckItem/DeckItem";
import DeckSearchItem from "../DeckSearchItem/DeckSearchItem";
// imported styles
import './DeckView.css';
// dialog imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
//modal settings
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// grid settings
import { styled } from '@mui/material/styles';
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

function DeckView() {
    const params = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    // imported stores
    const details = useSelector((store) => store.setDetails);
    const searchResult = useSelector((store) => store.setSearch);
    const inventory = useSelector((store) => store.setInventory);
    const commander = useSelector((store) => store.setCommander);
    const countCards = useSelector((store) => store.setCount);
    const cardsExport = useSelector((store) => store.setExport);
    // dialog modal settings
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    // handles dialog open 
    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };
    //handles dialog close
    const handleClose = () => {
        setOpen(false);
    };
    // pieces of state for search, edit mode, and updating deckName
    const [searchValue, setSearchValue] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [frontSide, setFrontSide] = useState(true);

    // modal settings
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        dispatch({
            type: 'GET_COMMANDER',
            payload: Number(params.id)
        })
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const flipImage = () => {
        setFrontSide(!frontSide);
    }

    // gets details based on params
    const getDetails = () => {
        dispatch({
            type: 'GET_DETAILS',
            payload: params.id
        })
        dispatch({
            type: 'GET_COMMANDER',
            payload: params.id
        })
    }
    //page load gets the details
    useEffect(() => {
        // handleRefresh(),
        getDetails();
    }, [params.id])

    // handles edit mode for the name of the deck
    const handleEditMode = () => {
        setEditMode(!editMode);
        setDeckName(details.deck_name);
    }

    // sends a search dispatch to the API and clears the input field after
    const sendSearch = () => {
        dispatch({
            type: 'SEND_SEARCH',
            payload: searchValue.split(' ').join('+')
        })
        setSearchValue('');
    }

    // dispatch that updates the deck name
    const updateDeck = () => {
        dispatch({
            type: 'UPDATE_DECK_NAME',
            payload: {
                deck_name: deckName,
                deck_id: Number(params.id)
            }
        })
        toast.success(`${deckName} has been updated.`)
        setEditMode(!editMode);
    }

    // handles deleting the deck, clears the details and deck reducers, pushes to deck page
    const deleteDeck = () => {
        console.log(details.deck_name);
        swal({
            title: "Warning!",
            text: `Are you sure you want to delete ${details.deck_name}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                inventory.map((card) => {
                    if (details.deck_contents !== null) {
                        for (let item of details?.deck_contents?.data) {
                            if (card.deck_id == params.id && card.scryfall_id === item.id) {
                                dispatch({
                                    type: 'UPDATE_INVENTORY_CARD_DELETE',
                                    payload: {
                                        deck_id: params.id,
                                        scryfall_id: card.scryfall_id,
                                        card_id: card.id,
                                    }
                                })
                            }
                        }
                    }
                })
                toast.success(`${details.deck_name} has been deleted.`)
                dispatch({
                    type: 'DELETE_DECK',
                    payload: Number(params.id)
                })
                dispatch({ type: 'CLEAR_DECK' });
                dispatch({ type: 'CLEAR_DETAILS' });
                dispatch({ type: 'CLEAR_COMMANDER' });
                history.push('/deck');
            } else {
                toast.success(`${details.deck_name} was not deleted.`)
            }
        });
    }

    // conditionally renders the card count based on various factors
    const renderCardCount = () => {
        if (details?.commander && details?.deck_contents?.data?.length > 0) {
            return details?.deck_contents?.data?.length + 1;
        } else if (details?.commander && details?.deck_contents?.length === 0) {
            return 1;
        } else if (!details?.commander && details?.deck_contents?.data?.length > 0) {
            return details.deck_contents.data.length;
        } else {
            return 0;
        }
    }

    // checks if the commander is in the inventory
    const checkCommanderInventory = () => {
        let count = 0;
        inventory.map((card) => {
            if (card.scryfall_id === commander.id) {
                count += 1;
            }
        })
        return count;
    }
    // sorts the details.deck_contents.data by type_line
    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            if (sortOrder == -1) {
                return b[property].localeCompare(a[property]);
            } else {
                return a[property].localeCompare(b[property]);
            }
        }
    }

    details.deck_contents?.data?.sort(dynamicSort("type_line"));

    let rows = [];

    const downloadTxtFile = () => {
        const element = document.createElement("a");
        for (let cardToExport of cardsExport) {
            rows.push(`\n\ ${cardToExport} x1`)
        }
        const file = new Blob(rows, { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "cards.txt";
        element.click();
        rows = [];
    }

    return (
        <div>
            <button onClick={downloadTxtFile}>Export</button>
            {/* null check for if details hasn't been populated with data yet */}
            {details?.length != 0 ?
                <>
                    <div className="deckContents">
                        <h3>{details?.deck_name}</h3>
                        {editMode ?
                            <>
                                <input
                                    value={deckName}
                                    placeholder={details.deck_name}
                                    onChange={(event) => setDeckName(event.target.value)}
                                />
                                <button onClick={updateDeck}>Save</button>
                                <button onClick={() => setEditMode(!editMode)}>Cancel</button>
                            </>
                            :
                            <>
                                <button onClick={handleEditMode}>Edit</button>
                                <button onClick={deleteDeck}>Delete Deck</button>
                            </>
                        }
                        <h4>Total Cards: {renderCardCount()}</h4>
                        <img className="commanderImg" onClick={handleOpenModal} src={details.deck_img} alt={details?.commander} />
                        <div >
                            <h4>Contents: <button onClick={handleClickOpen('paper')}>Add Cards</button></h4>
                            {details?.deck_contents?.data?.map((item, i) => {
                                return <DeckItem key={i} item={item} />
                            })}
                        </div>
                    </div>
                    <Dialog
                        className="dialogBox"
                        fullWidth={true}
                        maxWidth={'l'}
                        open={open}
                        onClose={handleClose}
                        scroll={scroll}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                    >
                        <DialogContent sx={{ textAlign: 'center' }}>
                            <div className="deckSearch">
                                <>
                                    <h4>Add Cards:</h4>
                                    <input
                                        autoFocus
                                        placeholder="Search Here"
                                        value={searchValue}
                                        onChange={(event) => setSearchValue(event.target.value)}
                                    />
                                    <button onClick={sendSearch}>Search</button>
                                    <button onClick={handleClose}>Close Search</button>
                                </>
                                <>
                                    <p>{searchResult?.details}</p>
                                    {searchResult?.data?.length > 0 && searchResult?.data?.map((item, i) => {
                                        return (
                                            <DeckSearchItem key={i} item={item} />
                                        )
                                    })}
                                </>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <div>
                            <Box sx={style}>
                                <Grid container spacing={4} columns={16}>
                                    <Grid item xs={16}>
                                        <h3 className="deckImgName">{commander.name}</h3>
                                    </Grid>
                                    <Grid item xs={8}>
                                        {!commander.image_uris ?
                                            <>
                                                {frontSide ?
                                                    <div className="deckItemDiv">
                                                        <ImageListItem key={commander.id}>
                                                            <img
                                                                className="deckImg"
                                                                src={!commander.name ?
                                                                    details.deck_img
                                                                    :
                                                                    commander?.card_faces[0]?.image_uris.normal
                                                                }
                                                                alt={commander.name}
                                                            />
                                                            <ImageListItemBar
                                                                title={commander.name}
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
                                                        <ImageListItem key={commander.id}>
                                                            <img className="deckImg" src={!commander.name ? details.deck_img : commander?.card_faces[1]?.image_uris.normal} alt={commander.name} />
                                                            <ImageListItemBar
                                                                title={commander.name}
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
                                                <img className="deckImg" src={!commander.name ? details.deck_img : commander.image_uris.normal} alt={commander.name} />
                                            </>
                                        }
                                    </Grid>
                                    <Grid item xs={8}>
                                        <div className="detailsContainer">
                                            <h5 className="cardDetails">Owned:
                                                {checkCommanderInventory() > 0 ?
                                                    <span style={{ color: 'green' }}> {checkCommanderInventory()}</span>
                                                    :
                                                    <span style={{ color: 'red' }}> {checkCommanderInventory()}</span>
                                                }</h5>
                                            <h5 className="cardDetails">Type: {commander.type_line}</h5>
                                            <h5 className="cardDetails">Set: {commander.set_name}</h5>
                                            <h5 className="cardDetails">Commander Legality:
                                                {commander?.legalities?.commander === 'legal' ?
                                                    <span> {commander.legalities.commander}</span>
                                                    :
                                                    <span style={{ color: 'red' }}> {commander?.legalities?.commander.replace(/_/g, " ")}</span>
                                                }
                                            </h5>
                                            <h5 className="cardDetails">Prices:
                                                <p className="cardDetails">Normal: ${commander?.prices?.usd !== null ? commander?.prices?.usd : '---'}</p>
                                                <p className="cardDetails">Foil: ${commander?.prices?.usd_foil !== null ? commander?.prices?.usd_foil : '---'}</p>
                                            </h5>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Box>
                        </div>
                    </Modal>
                </>
                :
                <>
                    <LoadingComponent />
                </>
            }
        </div>
    )
}

export default DeckView;