import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* sendSearch(action) {
    try {
        let searchResponse = yield axios({
            type: 'GET',
            url: `/api/search/${action.payload}`
        })
        yield put({
            type: 'SET_SEARCH',
            payload: searchResponse.data
        })
    } catch (error) {
        console.error('search request error', error)
    }
}

function* searchSaga() {
    yield takeEvery('SEND_SEARCH', sendSearch);
}

export default searchSaga;