const setDetails = (state = [], action) => {
    switch (action.type) {
        case 'SET_DETAILS':
            return action.payload;
        case 'CLEAR_DETAILS':
            return [];
        default:
            return state;
    }
}

export default setDetails;