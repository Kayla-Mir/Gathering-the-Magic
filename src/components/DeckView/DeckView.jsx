import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingComponent from "../Loading/Loading";

import DeckItem from "../DeckItem/DeckItem";
import DeckSearchItem from "../DeckSearchItem/DeckSearchItem";

function DeckView() {
    const params = useParams();
    const dispatch = useDispatch();
    const details = useSelector((store) => store.setDetails);
    const searchResult = useSelector((store) => store.setSearch);

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
                        <img src={details.deck_img} alt={details?.commander} />
                        <h4>Contents:</h4>
                        {details?.deck_contents?.data?.map((item, i) => {
                            return <DeckItem key={i} item={item} />
                        })}
                        <div>
                            <h5>Search for Cards:</h5>
                            <input
                                placeholder="Search Here"
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                            />
                            <button onClick={sendSearch}>Search</button>
                        </div>
                        <div>
                            <p>{searchResult?.details}</p>
                            {searchResult?.data?.length > 0 && searchResult?.data?.map((item, i) => {
                                return (
                                    <DeckSearchItem key={i} item={item} />
                                )
                            })}
                        </div>
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