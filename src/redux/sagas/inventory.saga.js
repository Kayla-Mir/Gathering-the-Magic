import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* getInventory() {
    try {
        const response = yield axios({
            method: 'GET',
            url: '/api/inventory'
        })
        yield put({
            type: 'SET_INVENTORY',
            payload: response.data
        })
    } catch (error) {
        console.error('inventory GET request error', error)
    }
}

function* addCard(action) {
    console.log('action.payload', action.payload);
    try {
        yield axios({
            method: 'POST',
            url: '/api/inventory',
            data: action.payload
        })
        yield put({
            type: 'FETCH_INVENTORY'
        })
    } catch (error) {
        console.error('inventory POST request error', error)
    }
}

function* inventorySaga() {
    yield takeEvery('FETCH_INVENTORY', getInventory);
    yield takeEvery('ADD_TO_INVENTORY', addCard);
}

export default inventorySaga;