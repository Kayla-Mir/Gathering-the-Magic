import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import toast from 'react-hot-toast';

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

function* addCardToInventory(action) {
    console.log('action.payload', action.payload);
    try {
        yield axios({
            method: 'POST',
            url: '/api/inventory',
            data: action.payload
        })
        toast.success(`${action.payload.name} has been added to your inventory!`);
        yield put({
            type: 'FETCH_INVENTORY'
        })
    } catch (error) {
        toast.error(`${action.payload.name} could not be added to your inventory at this time.`);
        console.error('inventory POST request error', error)
    }
}

function* updateInventoryCard(action) {
    console.log('action.payload for update', action.payload);
    try {
        yield axios({
            method: 'PUT', 
            url: '/api/inventory',
            data: action.payload
        })
        yield put({
            type: 'FETCH_INVENTORY'
        })
    } catch (error) {
        console.error('inventory PUT request error', error);
    }
}

function* updateInventoryCardDelete(action) {
    console.log('update inventory card delete', action.payload)
    try {
        yield axios({
            method: 'PUT', 
            url: '/api/inventory/deleteDeckId',
            data: action.payload
        })
        yield put({
            type: 'FETCH_INVENTORY'
        })
    } catch (error) {
        console.error('inventory PUT request error', error);
    }
}

function* deleteFromInventory(action) {
    try {
        yield axios({
            method: 'DELETE',
            url: '/api/inventory',
            data: action.payload
        })
        toast.success(`${action.payload.name} has been deleted.`);
        yield put({
            type: 'FETCH_INVENTORY'
        })
    } catch (error) {
        toast.error(`${action.payload.name} could not be deleted at this time.`);
        console.error('inventory DELETE request error', error)
    }
}

function* inventorySaga() {
    yield takeEvery('FETCH_INVENTORY', getInventory);
    yield takeEvery('ADD_TO_INVENTORY', addCardToInventory);
    yield takeEvery('DELETE_FROM_INVENTORY', deleteFromInventory);
    yield takeEvery('UPDATE_INVENTORY_CARD', updateInventoryCard);
    yield takeEvery('UPDATE_INVENTORY_CARD_DELETE', updateInventoryCardDelete);
}

export default inventorySaga;