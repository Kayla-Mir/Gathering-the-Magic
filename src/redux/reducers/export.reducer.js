const setExport = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TO_EXPORT':
            return [...state, action.payload];
        case 'CLEAR_EXPORT':
            return [];
        default:
            return state;
    }
}

export default setExport;