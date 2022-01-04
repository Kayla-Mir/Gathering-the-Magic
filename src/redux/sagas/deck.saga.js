import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

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

function* addDeck(action) {
    console.log('action.payload', action.payload);
    try {
        yield axios({
            method: 'POST',
            url: '/api/inventory',
            data: action.payload
        })
        yield put({
            type: 'FETCH_DECK'
        })
    } catch (error) {
        console.error('inventory POST request error', error)
    }
}

function* deleteDeck(action) {
    console.log('action.payload', action.payload);
    try {
        yield axios({
            method: 'DELETE',
            url: '/api/inventory',
            data: action.payload
        })
        yield put({
            type: 'FETCH_DECK'
        })
    } catch (error) {
        console.error('inventory DELETE request error', error)
    }
}

function* deckSaga() {
    yield takeEvery('FETCH_DECK', getDeck);
    yield takeEvery('ADD_DECK', addDeck);
    yield takeEvery('DELETE_DECK', deleteDeck);
    yield takeEvery('GET_DETAILS', getDetails);
}

export default deckSaga;