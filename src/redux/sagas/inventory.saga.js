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

function* addCardToInventory(action) {
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

function* deleteFromInventory(action) {
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

// function* checkInventory(action) {
//     console.log('action.payload', action.payload)
//     try {
//         const response = yield axios({
//             method: 'GET',
//             url: `/api/inventory/${action.payload}`
//         })
//         // TODO: FIGURE THIS OUT 
//         if (response.data[0].length > 0) {
//             yield put({
//                 type: 'SET_CARDS_OWNED',
//                 payload: response[0].data
//             })
//         }
//     } catch (error) {
//         console.error('inventory GET request error', error)
//     }
// }

function* inventorySaga() {
    yield takeEvery('FETCH_INVENTORY', getInventory);
    yield takeEvery('ADD_TO_INVENTORY', addCardToInventory);
    yield takeEvery('DELETE_FROM_INVENTORY', deleteFromInventory);
    // yield takeEvery('CHECK_INVENTORY', checkInventory);
}

export default inventorySaga;