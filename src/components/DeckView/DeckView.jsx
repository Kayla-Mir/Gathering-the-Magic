import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
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
                swal(`${details.deck_name} has been deleted.`, {
                    icon: "success",
                });
                dispatch({
                    type: 'DELETE_DECK',
                    payload: Number(params.id)
                })
                dispatch({ type: 'CLEAR_DECK' });
                dispatch({ type: 'CLEAR_DETAILS' });
                dispatch({ type: 'CLEAR_COMMANDER' });
                history.push('/deck');
            } else {
                swal(`${details.deck_name} was not deleted.`)
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

    const checkInventory = () => {
        let count = 0;
        inventory.map((card) => {
            if (card.scryfall_id === commander.id) {
                count += 1;
            }
        })
        return (count)
    }

    console.log('details', details)
    console.log('commander', commander)

    return (
        <div>
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
                        <h4>Cards: {renderCardCount()}
                        </h4>
                        <img className="commanderImg" onClick={handleOpenModal} src={details.deck_img} alt={details?.commander} />
                        <div >
                            <h4>Contents: <button onClick={handleClickOpen('paper')}>Add Cards</button></h4>
                            {details?.deck_contents?.data?.map((item, i) => {
                                return <DeckItem key={i} item={item} />
                            })}
                        </div>
                    </div>
                    <Dialog
                        fullWidth={true}
                        maxWidth={'l'}
                        open={open}
                        onClose={handleClose}
                        scroll={scroll}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                    >
                        <DialogContent >
                            <div className="deckSearch">
                                <>
                                    <h5>Add Cards:</h5>
                                    <input
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
                                                    <img className="deckImg" src={!commander.name ? details.deck_img : commander?.card_faces[0]?.image_uris.normal} alt={commander.name} />
                                                    :
                                                    <img className="deckImg" src={!commander.name ? details.deck_img : commander?.card_faces[1]?.image_uris.normal} alt={commander.name} />
                                                }
                                                <br />
                                                <button onClick={flipImage}>Flip</button>
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
                                                {checkInventory() > 0 ?
                                                    <span style={{ color: 'green' }}> {checkInventory()}</span>
                                                    :
                                                    <span style={{ color: 'red' }}> {checkInventory()}</span>
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