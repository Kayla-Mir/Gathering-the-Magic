import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

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
            {details[0]?.length != 0 ?
                <>
                    <h3>{details[0]?.deck_name}</h3>
                    <img src={details[0]?.deck_img} alt={details[0]?.commander} />
                    <h4>Contents:</h4>
                    {details[0]?.deck_contents?.map((item, i) => {
                        return <p key={i}>{item}</p>
                    })}
                    {/* <button
                        id="backHomeButton"
                        onClick={() => history.push('/')}
                        variant="contained"
                    >
                        Back To List
                    </button> */}
                </>
                :
                <></>
            }
        </div>
    )
}

export default DeckView;