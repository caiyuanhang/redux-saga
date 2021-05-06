import {
    takeEvery,
    takeLatest,
    throttle,
    select,
    call,
    take
} from 'redux-saga/effects';

import axios from 'axios';
const baseUrl = axios.create({
    baseURL: "http://localhost:3000/user",
    headers: {
        "Content-Type": "application/json"
    }
});

export function* defSaga() {
    yield takeEvery("takeEvery", function* (){
        const user = yield select(state => state.user);
        console.log("select_state：", user);

        const res = yield call(axios.get, "http://localhost:3000/user")
        console.log("call_res：",res);
    });

    yield take("take");
    console.log("take");

    yield takeLatest("takeLatest", function* (){
        console.log("takeLatest");
    })

    yield throttle(0, "throttle", function* (){
        console.log("throttle");
    })
}