import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InventoryItem from "../InventoryItem/InventoryItem";

function InventoryPage() {
    const dispatch = useDispatch();
    const inventory = useSelector((store) => store.setInventory);

    useEffect(() => {
        dispatch({
            type: 'FETCH_INVENTORY'
        })
    }, [])

    return (
        <div>
            <h2>Your Inventory!</h2>
            <div>
                {inventory?.length > 0 && inventory?.map((item, i) => {
                    return (
                        <InventoryItem key={i} item={item} />
                    )
                })}
            </div>
        </div>
    )
}

export default InventoryPage;