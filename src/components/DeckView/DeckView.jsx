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

function DeckView() {
    const params = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    // imported stores
    const details = useSelector((store) => store.setDetails);
    const searchResult = useSelector((store) => store.setSearch);
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
    
    // gets details based on params
    const getDetails = () => {
        dispatch({
            type: 'GET_DETAILS',
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

    return (
        <div>
            {/* null check for if details hasn't been populated with data yet */}
            {details?.length != 0 ?
                <>
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
                            <img className="commanderImg" src={details.deck_img} alt={details?.commander} />
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
                    </>
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