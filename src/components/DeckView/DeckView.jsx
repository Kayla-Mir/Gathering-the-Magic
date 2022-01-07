import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingComponent from "../Loading/Loading";

import './DeckView.css';
import DeckItem from "../DeckItem/DeckItem";
import DeckSearchItem from "../DeckSearchItem/DeckSearchItem";

// modal imports
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

// dialog imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: 'auto',
    textAlign: 'center',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function DeckView() {
    const params = useParams();
    const dispatch = useDispatch();
    const details = useSelector((store) => store.setDetails);
    const searchResult = useSelector((store) => store.setSearch);

    // dialog modal settings
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);

    const [searchValue, setSearchValue] = useState('');
    const [editMode, setEditMode] = useState(false);

    const [deckName, setDeckName] = useState(details?.deck_name);

    console.log('details', details);

    const getDetails = () => {
        dispatch({
            type: 'GET_DETAILS',
            payload: params.id
        })
    }

    useEffect(() => {
        // handleRefresh(),
        getDetails();
    }, [params.id])

    const handleEditMode = () => {
        setEditMode(!editMode);
    }

    const sendSearch = () => {
        dispatch({
            type: 'SEND_SEARCH',
            payload: searchValue.split(' ').join('+')
        })
        setSearchValue('');
    }

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
                                        placeholder="Deck Name"
                                        onChange={(event) => setDeckName(event.target.value)}
                                    />
                                    <button onClick={updateDeck}>Save</button>
                                    <button onClick={() => setEditMode(!editMode)}>Cancel</button>
                                </>
                                :
                                <>
                                    <button onClick={handleEditMode}>Edit</button>
                                </>
                            }
                            <h4>Cards: {details?.deck_contents?.data?.length + 1 || 0}</h4>
                            <img className="commanderImg" src={details.deck_img} alt={details?.commander} />
                            <div className="deckContents">
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