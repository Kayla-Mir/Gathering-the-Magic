import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchItem from "../SearchItem/SearchItem";

function SearchPage() {
    const dispatch = useDispatch();
    const searchResult = useSelector((store) => store.setSearch);

    const [searchValue, setSearchValue] = useState('');

    const sendSearch = () => {
        dispatch({
            type: 'SEND_SEARCH',
            payload: searchValue.split(' ').join('+')
        })
        setSearchValue('');
    }

    return (
        <div>
            <div>
                <h2>Search for Magic Cards!</h2>
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
                        <SearchItem key={i} item={item} />
                    )
                })}
            </div>
        </div>
    )
}

export default SearchPage;