const setCommander = (state = [], action) => {
    switch (action.type) {
        case 'SET_COMMANDER':
            return action.payload;
        case 'CLEAR_COMMANDER':
            return [];
        default:
            return state;
    }
}

export default setCommander;