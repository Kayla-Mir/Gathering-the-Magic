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
    }, [])

    return (
        <div>
            <h2>Your Inventory!</h2>
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Toughness</TableCell>
                                <TableCell>Power</TableCell>
                                <TableCell>CMC</TableCell>
                                <TableCell>Set</TableCell>
                                <TableCell>Color Identity</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Add to Deck</TableCell>
                                <TableCell>Delete</TableCell>
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
        </div>
    )
}

export default InventoryPage;