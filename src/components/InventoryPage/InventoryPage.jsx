import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InventoryItem from "../InventoryItem/InventoryItem";

// table imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function InventoryPage() {
    const dispatch = useDispatch();
    const inventory = useSelector((store) => store.setInventory);

    useEffect(() => {
        dispatch({ type: 'FETCH_INVENTORY' });
    }, [JSON.stringify(inventory)])

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

    inventory.sort(dynamicSort("name"));

    return (
        <div style={{ textAlign: "center", marginTop: '60px' }}>
            <h1 style={{marginBottom: '30px', fontFamily: 'sans-serif', fontWeight: 'normal'}}>Inventory</h1>
            <TableContainer component={Paper} sx={{ width: '75%', margin: 'auto', boxShadow: '0px 7px 5px rgb(140, 140, 140);' }} >
                <Table size="small">
                    <TableHead >
                        <TableRow sx={{
                            "& th": {
                                fontSize: "18px",
                                backgroundColor: "#c4c3d0",
                                borderBottom: "2px solid gray",
                            }
                        }}>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Toughness</TableCell>
                            <TableCell align="center">Power</TableCell>
                            <TableCell align="center">CMC</TableCell>
                            <TableCell align="center">Set</TableCell>
                            <TableCell align="center">Color Identity</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Add to Deck / In Deck</TableCell>
                            <TableCell align="center">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory?.length > 0 && inventory?.map((item, i) => {
                            return (
                                <InventoryItem key={i} item={item} />
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default InventoryPage;