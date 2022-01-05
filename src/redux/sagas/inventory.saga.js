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
        swal({
            title: "Success!",
            text: `You added ${action.payload.name} to your inventory!`,
            icon: "success",
            button: "OK",
          });
        yield put({
            type: 'FETCH_INVENTORY'
        })
    } catch (error) {
        swal({
            title: "Sorry!",
            text: `${action.payload.name} could not be added to your inventory at this time.`,
            icon: "error",
            button: "OK",
          });
        console.error('inventory POST request error', error)
    }
}

function* deleteCard(action) {
    console.log('action.payload', action.payload);
    try {
        yield axios({
            method: 'DELETE',
            url: '/api/inventory',
            data: action.payload
        })
        yield put({
            type: 'FETCH_INVENTORY'
        })
    } catch (error) {
        console.error('inventory DELETE request error', error)
    }
}

function* inventorySaga() {
    yield takeEvery('FETCH_INVENTORY', getInventory);
    yield takeEvery('ADD_TO_INVENTORY', addCard);
    yield takeEvery('DELETE_FROM_INVENTORY', deleteCard)
}

export default inventorySaga;