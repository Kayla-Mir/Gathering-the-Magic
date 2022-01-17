import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import toast from 'react-hot-toast';


function* getDeck() {
    try {
        const response = yield axios({
            method: 'GET',
            url: '/api/deck'
        })
        yield put({
            type: 'SET_DECK',
            payload: response.data
        })
    } catch (error) {
        console.error('inventory GET request error', error)
    }
}

function* getDetails(action) {
    const deckId = action.payload;
    try {
        const response = yield axios({
            method: 'GET',
            url: `/api/deck/${deckId}`
        })
        yield put({
            type: 'SET_DETAILS',
            payload: response.data
        })
    } catch (error) {
        console.error('GET details by id', error)
    }
}

function* getCommander(action) {
    const deckId = action.payload;
    try {
        const response = yield axios({
            method: 'GET',
            url: `/api/deck/commander/${deckId}`
        })
        yield put({
            type: 'SET_COMMANDER',
            payload: response.data
        })
    } catch (error) {
        console.error('GET commander', error)
    }
}

function* createDeck(action) {
    try {
        yield axios({
            method: 'POST',
            url: '/api/deck',
            data: action.payload
        })
        yield put({
            type: 'FETCH_DECK'
        })
    } catch (error) {
        console.error('deck POST error', error)
    }
}

function* updateDeckContents(action) {
    try {
        const response = yield axios({
            method: 'PUT',
            url: '/api/deck/contents',
            data: action.payload
        })
        toast.success(`${action.payload.cardToAdd.name} has been added to ${action.payload.deck_name}.`)
        yield put({
            type: 'GET_DETAILS',
            payload: response.data.id
        })
        yield put({
            type: 'FETCH_INVENTORY'
        })
        yield put({
            type: 'CLEAR_AVAILABLE'
        })
    } catch (error) {
        toast.error(`${action.payload.cardToAdd.name} could not be added to ${action.payload.deck_name} at this time.`)
        console.error('PUT deckContents error', error)
    }
}

function* autoFillDeckContents(action) {
    try {
        const response = yield axios({
            method: 'PUT',
            url: '/api/deck/contents/fill',
            data: action.payload
        })
        yield put({
            type: 'GET_DETAILS',
            payload: response.data.id
        })
        yield put({
            type: 'FETCH_INVENTORY'
        })
        yield put({
            type: 'CLEAR_AVAILABLE'
        })
    } catch (error) {
        console.error('PUT deckContents error', error)
    }
}

function* updateDeckName(action) {
    try {
        const response = yield axios({
            method: 'PUT',
            url: '/api/deck/name',
            data: action.payload
        })
        yield put({
            type: 'GET_DETAILS',
            payload: response.data.id
        })
    } catch (error) {
        console.error('PUT deckName error', error)
    }
}

function* updateDeckCommander(action) {
    try {
        const response = yield axios({
            method: 'PUT',
            url: '/api/deck/commander',
            data: action.payload
        })
        toast.success(`${action.payload.commander} has been set as your commander!`)
        yield put({
            type: 'GET_DETAILS',
            payload: response.data.id
        })
    } catch (error) {
        toast.error(`${action.payload.cardToAdd.name} could not be set as your commander.`)
        console.error('PUT deckName error', error)
    }
}

function* deleteFromDeck(action) {
    try {
        const response = yield axios({
            method: 'DELETE',
            url: '/api/deck',
            data: action.payload
        })
        toast.success(`${action.payload.cardToDelete.name} has been deleted.`)
        yield put({
            type: 'GET_DETAILS',
            payload: response.data.id
        })
        yield put({
            type: 'CLEAR_EXPORT'
        })
    } catch (error) {
        toast.error(`${action.payload.cardToDelete.name} could not be deleted.`)
        console.error('inventory DELETE request error', error)
    }
}

function* deleteDeck(action) {
    try {
        yield axios({
            method: 'DELETE',
            url: `/api/deck/${action.payload}`
        })
        yield put({
            type: 'FETCH_DECK'
        })
    } catch (error) {
        console.error('delete deck error', error)
    }
}

function* deckSaga() {
    yield takeEvery('FETCH_DECK', getDeck);
    yield takeEvery('GET_DETAILS', getDetails);
    yield takeEvery('GET_COMMANDER', getCommander);
    yield takeEvery('NEW_DECK', createDeck);
    yield takeEvery('UPDATE_DECK_CONTENTS', updateDeckContents);
    yield takeEvery('UPDATE_DECK_NAME', updateDeckName);
    yield takeEvery('UPDATE_DECK_COMMANDER', updateDeckCommander);
    yield takeEvery('DELETE_FROM_DECK', deleteFromDeck);
    yield takeEvery('DELETE_DECK', deleteDeck);
    yield takeEvery('AUTO_FILL', autoFillDeckContents);
}

export default deckSaga;