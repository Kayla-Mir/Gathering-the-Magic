import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AwesomeComponent from "../Loading/Loading";

import DeckItem from "../DeckItem/DeckItem";

function DeckView() {
    const params = useParams();
    const dispatch = useDispatch();
    const details = useSelector((store) => store.setDetails);

    console.log('details', details)

    useEffect(() => {
        // handleRefresh(),
        dispatch({
            type: 'GET_DETAILS',
            payload: params.id
        })
    }, [params.id])

    return (
        <div>
            {/* null check for if details hasn't been populated with data yet */}
            {details?.length != 0 ?
                <>
                    <h3>{details?.deck_name}</h3>
                    <h4>Cards: {details?.deck_contents?.data?.length}</h4>
                    <img src={details?.deck_img} alt={details?.commander} />
                    <h4>Contents:</h4>
                    {details?.deck_contents?.data?.map((item, i) => {
                        return <DeckItem key={i} item={item} />
                    })}
                </>
                :
                <>
                    <AwesomeComponent />
                </>
            }
                {/* <>
                    <AwesomeComponent />
                </> */}
        </div>
    )
}

export default DeckView;