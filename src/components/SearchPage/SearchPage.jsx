import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchItem from "../SearchItem/SearchItem";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './SearchPage.css'
import { Button, Stack, TextField } from "@mui/material";
// color theme for buttons
const theme = createTheme({
    palette: {
        primary: {
            main: '#55476f',
            darker: '#41335c',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
    },
});

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
        <div className="searchDiv">
            <div>
                <h2 style={{marginBottom: '50px'}}>Search for Magic Cards!</h2>
                    <TextField
                        sx={{width: '20vw', marginBottom: '30px'}}
                        size="small"
                        placeholder="Search Here"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                    <ThemeProvider theme={theme}>
                        <Button style={{marginLeft: '10px'}} variant="contained" onClick={sendSearch}>Search</Button>
                    </ThemeProvider>
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