const setDeck = (state = [], action) => {
    switch (action.type) {
        case 'SET_DECK':
            return action.payload;
        case 'CLEAR_DECK':
            return [];
        default:
            return state;
    }
}

export default setDeck;