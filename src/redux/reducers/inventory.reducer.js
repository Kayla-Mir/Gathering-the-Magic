const setInventory = (state = [], action) => {
    switch (action.type) {
        case 'SET_INVENTORY':
            return action.payload;
        case 'CLEAR_INVENTORY':
            return [];
        default:
            return state;
    }
}

export default setInventory;