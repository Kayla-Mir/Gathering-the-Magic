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

function* createDeck(action) {
    console.log('action.payload createDeck', action.payload);
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
        swal({
            title: "Success!",
            text: `You added ${action.payload.cardToAdd.name} to your ${action.payload.deck_name} deck!`,
            icon: "success",
            button: "OK",
        });
        yield put({
            type: 'GET_DETAILS',
            payload: response.data.id
        })
    } catch (error) {
        swal({
            title: "Sorry!",
            text: `${action.payload.cardToAdd.name} could not be added to your deck at this time.`,
            icon: "error",
            button: "OK",
        });
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
        yield put ({
            type: 'GET_DETAILS',
            payload: response.data.id
        })
    } catch (error) {
        console.error('PUT deckName error', error)
    }
}

function* updateDeckCommander(action) {
    console.log('commander update', action.payload)
    try {
        const response = yield axios({
            method: 'PUT',
            url: '/api/deck/commander',
            data: action.payload
        })
        swal({
            title: "Success!",
            text: `You set ${action.payload.commander} as your commander!`,
            icon: "success",
            button: "OK",
        });
        yield put ({
            type: 'GET_DETAILS',
            payload: response.data.id
        })
    } catch (error) {
        swal({
            title: "Sorry!",
            text: `${action.payload.commander} could not be set as your commander.`,
            icon: "error",
            button: "OK",
        });
        console.error('PUT deckName error', error)
    }
}

function* deleteFromDeck(action) {
    console.log('action.payload', action.payload);
    try {
        const response = yield axios({
            method: 'DELETE',
            url: '/api/deck',
            data: action.payload
        })
        yield put({
            type: 'GET_DETAILS',
            payload: response.data.id
        })
    } catch (error) {
        console.error('inventory DELETE request error', error)
    }
}

function* deleteDeck(action) {
    try {
        yield axios ({
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
    yield takeEvery('NEW_DECK', createDeck);
    yield takeEvery('UPDATE_DECK_CONTENTS', updateDeckContents);
    yield takeEvery('UPDATE_DECK_NAME', updateDeckName);
    yield takeEvery('UPDATE_DECK_COMMANDER', updateDeckCommander);
    yield takeEvery('DELETE_FROM_DECK', deleteFromDeck);
    yield takeEvery('DELETE_DECK', deleteDeck);
}

export default deckSaga;