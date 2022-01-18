import { createRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { IconButton, ImageListItem, ImageListItemBar, Input, Stack, TextField } from "@mui/material";
import toast from 'react-hot-toast';
// imported components
import LoadingComponent from "../Loading/Loading";
import DeckItem from "../DeckItem/DeckItem";
import DeckSearchItem from "../DeckSearchItem/DeckSearchItem";
// chart.js imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
    borderRadius: '17px',
    boxShadow: 24,
    p: 4,
};
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
    breakpoints: {
        values: {
            xs: 240,
            sm: 900,
            md: 1060,
            lg: 1660,
            xl: 1920,
        }
    }
});

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
        dispatch({
            type: 'CLEAR_SEARCH'
        })
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
        getGraphData();
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
            rows.push(`\n\ 1 ${cardToExport}`)
        }
        const file = new Blob(rows, { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "cards.txt";
        element.click();
        rows = [];
    }

    const fillInCards = () => {
        dispatch({
            type: 'AUTO_FILL',
            payload: {
                deck_id: Number(params.id)
            }
        })
    }

    const colorBreakdown = {
        red: 0,
        blue: 0,
        white: 0,
        green: 0,
        black: 0,
    }
    // chart stuff????
    ChartJS.register(ArcElement, Tooltip, Legend);

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Doughnut Chart'
                }
            }
        },
    };

    const data = {
        labels: ['Red', 'Blue', 'White', 'Green', 'Black'],
        datasets: [
            {
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgb(211,31,42)',
                    'rgb(16,105,171)',
                    'rgb(246,228,183)',
                    'rgb(1,114,62)',
                    'rgb(22,10,0)',
                ],
                borderColor: [
                    'rgb(211,31,42)',
                    'rgb(16,105,171)',
                    'rgb(246,228,183)',
                    'rgb(1,114,62)',
                    'rgb(22,10,0)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const countColors = (cardToCheck) => {
        if (cardToCheck?.card_faces) {
            for (let i = 0; i < cardToCheck?.card_faces[0]?.mana_cost.length; i++) {
                const positionToCheckFront = cardToCheck?.card_faces[0]?.mana_cost[i];
                if (positionToCheckFront === 'R') {
                    colorBreakdown.red += 1;
                }
                if (positionToCheckFront === 'U') {
                    colorBreakdown.blue += 1;
                }
                if (positionToCheckFront === 'W') {
                    colorBreakdown.white += 1;
                }
                if (positionToCheckFront === 'G') {
                    colorBreakdown.green += 1;
                }
                if (positionToCheckFront === 'B') {
                    colorBreakdown.black += 1;
                }
            }
            for (let i = 0; i < cardToCheck?.card_faces[1]?.mana_cost.length; i++) {
                const positionToCheckBack = cardToCheck?.card_faces[1]?.mana_cost[i];
                if (positionToCheckBack === 'R') {
                    colorBreakdown.red += 1;
                }
                if (positionToCheckBack === 'U') {
                    colorBreakdown.blue += 1;
                }
                if (positionToCheckBack === 'W') {
                    colorBreakdown.white += 1;
                }
                if (positionToCheckBack === 'G') {
                    colorBreakdown.green += 1;
                }
                if (positionToCheckBack === 'B') {
                    colorBreakdown.black += 1;
                }
            }
        } else {
            for (let i = 0; i < cardToCheck?.mana_cost.length; i++) {
                const positionToCheck = cardToCheck?.mana_cost[i];
                if (positionToCheck === 'R') {
                    colorBreakdown.red += 1;
                }
                if (positionToCheck === 'U') {
                    colorBreakdown.blue += 1;
                }
                if (positionToCheck === 'W') {
                    colorBreakdown.white += 1;
                }
                if (positionToCheck === 'G') {
                    colorBreakdown.green += 1;
                }
                if (positionToCheck === 'B') {
                    colorBreakdown.black += 1;
                }
            }
        }
        data.datasets[0].data[0] = colorBreakdown.red;
        data.datasets[0].data[1] = colorBreakdown.blue;
        data.datasets[0].data[2] = colorBreakdown.white;
        data.datasets[0].data[3] = colorBreakdown.green;
        data.datasets[0].data[4] = colorBreakdown.black;
    }

    const getGraphData = () => {
        details?.deck_contents?.data?.map((cardToCheck) => {
            countColors(cardToCheck);
        })
        console.log('color breakdown', colorBreakdown)
    }

    return (
        <div>
            {/* null check for if details hasn't been populated with data yet */}
            {details?.length != 0 ?
                <>
                    <ThemeProvider theme={theme}>
                        <Box sx={{ flexGrow: 1 }} >
                            <Grid container spacing={2} columns={6}>
                                <Grid item xs={1} sx={{ maxHeight: '485px' }}>

                                </Grid>
                                <Grid item xs={1} sx={{ maxHeight: '485px', minWidth: '375px' }}>
                                    <div style={{ display: 'inline-block', paddingLeft: '30px' }}>
                                        <h3 style={{ textAlign: 'center' }}>Commander</h3>
                                        <img className="commanderImg" onClick={handleOpenModal} src={details.deck_img} alt={details?.commander} />
                                    </div>
                                </Grid>
                                <Grid item xs={1} sx={{ maxHeight: '485px', minWidth: '250px' }}>
                                    <div style={{ display: 'inline-block', paddingTop: '80px' }}>
                                        <h2 onClick={() => setDeckName('God Tribal')}>{details?.deck_name}</h2>
                                        {editMode ?
                                            <>
                                                <TextField
                                                    size="small"
                                                    style={{ display: 'block', marginBottom: '10px' }}
                                                    value={deckName}
                                                    placeholder={details.deck_name}
                                                    onChange={(event) => setDeckName(event.target.value)}
                                                />
                                                <ThemeProvider theme={theme}>
                                                    <Stack direction="row" spacing={1}>
                                                        <Button variant="contained" color="primary" size="small" spacing={2} onClick={updateDeck}>Save</Button>
                                                        <Button variant="contained" color="primary" size="small" onClick={() => setEditMode(!editMode)}>Cancel</Button>
                                                    </Stack>
                                                </ThemeProvider>
                                            </>
                                            :
                                            <ThemeProvider theme={theme}>
                                                <Stack direction="row" spacing={1}>
                                                    <Button style={{ display: 'block' }} variant="contained" color="primary" size="small" onClick={handleEditMode}>Edit</Button>
                                                    <Button variant="contained" color="primary" size="small" onClick={deleteDeck}>Delete Deck</Button>
                                                </Stack>
                                            </ThemeProvider>
                                        }
                                        {getGraphData()}
                                        <br />
                                        <h3 onClick={fillInCards} style={{}}>Total Cards: {renderCardCount()}</h3>
                                        <ThemeProvider theme={theme}>
                                            <Button size="small" variant="contained" color="primary" style={{ display: 'inline-block', marginTop: '50px' }} onClick={downloadTxtFile}>Export Unowned Cards</Button>
                                        </ThemeProvider>
                                    </div>
                                </Grid>
                                <Grid item xs={2} sx={{ maxHeight: '485px', minWidth: '250px' }}>
                                    <h3 style={{ textAlign: 'center' }}>Color Breakdown</h3>
                                    <Doughnut data={data} style={{ maxHeight: '400px' }} />
                                </Grid>
                                <Grid item xs={1} sx={{ maxHeight: '485px' }}>

                                </Grid>
                            </Grid>
                        </Box>
                    </ThemeProvider>

                    {/* <div style={{ display: 'inline-block', position: 'absolute', paddingTop: '25px', marginLeft: '750px' }}>
                            <h2 style={{ display: 'inline-block' }}>{details?.deck_name}</h2>
                            {editMode ?
                                <>
                                    <TextField
                                        size="small"
                                        style={{ display: 'block', marginBottom: '10px' }}
                                        value={deckName}
                                        placeholder={details.deck_name}
                                        onChange={(event) => setDeckName(event.target.value)}
                                    />
                                    <ThemeProvider theme={theme}>
                                        <Stack direction="row" spacing={1}>
                                            <Button variant="contained" color="primary" size="small" spacing={2} onClick={updateDeck}>Save</Button>
                                            <Button variant="contained" color="primary" size="small" onClick={() => setEditMode(!editMode)}>Cancel</Button>
                                        </Stack>
                                    </ThemeProvider>
                                </>
                                :
                                <ThemeProvider theme={theme}>
                                    <Stack direction="row" spacing={1}>
                                        <Button style={{ display: 'block' }} variant="contained" color="primary" size="small" onClick={handleEditMode}>Edit</Button>
                                        <Button variant="contained" color="primary" size="small" onClick={deleteDeck}>Delete Deck</Button>
                                    </Stack>
                                </ThemeProvider>
                            }
                            {getGraphData()}
                            <br />

                            <h3 onClick={fillInCards} style={{ paddingTop: '30px' }}>Total Cards: {renderCardCount()}</h3>
                            <ThemeProvider theme={theme}>
                                <Button size="small" variant="contained" color="primary" style={{ display: 'inline-block', marginTop: '50px' }} onClick={downloadTxtFile}>Export Unowned Cards</Button>
                            </ThemeProvider>
                        </div> */}
                    {/* <div style={{ display: 'inline-block', marginLeft: '405px' }}>
                            <img className="commanderImg" style={{ display: 'inline-block' }} onClick={handleOpenModal} src={details.deck_img} alt={details?.commander} />
                        </div> */}
                    {/* <div style={{ display: 'inline-block', float: 'right', marginRight: '400px' }}>
                            <h3 style={{ textAlign: 'center' }}>Color Breakdown</h3>
                            <Doughnut data={data} />
                        </div> */}
                    <div className="deckContents">
                        <div>
                            <ThemeProvider theme={theme}><Button style={{ display: 'block', margin: '20px 0px 20px 15px' }} variant="contained" color="primary" size="small" onClick={handleClickOpen('paper')}>Add Cards</Button></ThemeProvider>
                            {details?.deck_contents?.data?.map((item, i) => {
                                return <DeckItem key={i} item={item} />
                            })}
                        </div>
                    </div>
                    <Dialog
                        className="dialogBox"
                        fullWidth={true}
                        maxWidth={'xl'}
                        open={open}
                        onClose={handleClose}
                        scroll={scroll}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                    >
                        <DialogContent sx={{ textAlign: 'center' }}>
                            <Box className="deckSearch">
                                <>
                                    <h3>Add Cards:</h3>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        autoFocus
                                        placeholder="Search Here"
                                        value={searchValue}
                                        onChange={(event) => setSearchValue(event.target.value)}
                                        style={{width: '250px'}}
                                    />
                                    <ThemeProvider theme={theme}>
                                        <Stack direction={"row"} spacing={1} sx={{ display: 'block', marginTop: '10px' }}>
                                            <Button variant="contained" color="primary" size="medium" onClick={sendSearch}>Search</Button>
                                            <Button variant="contained" color="primary" size="medium" onClick={handleClose}>Close Search</Button>
                                        </Stack>
                                    </ThemeProvider>
                                </>
                                <>
                                    <p>{searchResult?.details}</p>
                                    {searchResult?.data?.length > 0 && searchResult?.data?.map((item, i) => {
                                        return (
                                            <DeckSearchItem key={i} item={item} />
                                        )
                                    })}
                                </>
                            </Box>
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
                                    <Grid item xs={8}>
                                        {!commander.image_uris ?
                                            <>
                                                {frontSide ?
                                                    <div className="deckItemDiv">
                                                        <ImageListItem key={commander.id}>
                                                            <img
                                                                className="commanderImgDV"
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
                                                            <img className="commanderImgDV" src={!commander.name ? details.deck_img : commander?.card_faces[1]?.image_uris.normal} alt={commander.name} />
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
                                                <img className="commanderImgDV" src={!commander.name ? details.deck_img : commander.image_uris.normal} alt={commander.name} />
                                            </>
                                        }
                                    </Grid>
                                    <Grid item xs={8}>
                                        <div className="detailsContainerDV">
                                            <h3 className="cardDetails">Owned:
                                                {checkCommanderInventory() > 0 ?
                                                    <span style={{ color: 'green', fontWeight: 'normal' }}> {checkCommanderInventory()}</span>
                                                    :
                                                    <span style={{ color: 'red', fontWeight: 'normal' }}> {checkCommanderInventory()}</span>
                                                }</h3>
                                            <h3 className="cardDetails">Type: <span style={{ fontWeight: 'normal' }}>{commander.type_line}</span></h3>
                                            <h3 className="cardDetails">Set: <span style={{ fontWeight: 'normal' }}>{commander.set_name}</span></h3>
                                            <h3 className="cardDetails">Commander Legality:
                                                {commander?.legalities?.commander === 'legal' ?
                                                    <span style={{ fontWeight: 'normal' }}> {commander.legalities.commander}</span>
                                                    :
                                                    <span style={{ color: 'red', fontWeight: 'normal' }}> {commander?.legalities?.commander.replace(/_/g, " ")}</span>
                                                }
                                            </h3>
                                            <h3 className="cardDetails">Price:
                                                <p className="cardDetails">Normal: <span style={{ fontWeight: 'normal' }}>${commander?.prices?.usd !== null ? commander?.prices?.usd : '---'}</span></p>
                                                <p className="cardDetails">Foil: <span style={{ fontWeight: 'normal' }}>${commander?.prices?.usd_foil !== null ? commander?.prices?.usd_foil : '---'}</span></p>
                                            </h3>
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