import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 340,
    textAlign: 'center',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function DeckPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const decks = useSelector((store) => store.setDeck);

    // modal settings
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        dispatch({
            type: 'FETCH_DECK'
        })
    }, [])

    const createDeck = () => {
        dispatch({
            type: 'NEW_DECK',
            payload: { deck_name: 'untitled' }
        })
    }

    console.log('decks', decks)

    return (
        <>
            <div>
                <button onClick={createDeck}>New Deck</button>
                {/* <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div>
                        <Box sx={style}>
                            <input
                                placeholder="Name of Deck"
                                value={newDeckName}
                                onChange={(event) => setNewDeckName(event.target.value)}
                            />
                            <button onClick={createDeck}>Create Deck</button>
                        </Box>
                    </div>
                </Modal> */}
            </div>
            {decks?.length > 0 && decks?.map((deck) => {
                return (
                    <div key={deck.id}>
                        <h3>{deck.deck_name}</h3>
                        <h4>Cards: {deck.deck_contents?.length}</h4>
                        <img
                            onClick={() => history.push(`/deckView/${deck.id}`)}
                            src={deck.deck_img}
                            alt={deck.commander}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default DeckPage;