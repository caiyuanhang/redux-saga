import { defReducer } from './reducers';
import { defSaga } from './sagas';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(defReducer,applyMiddleware(sagaMiddleware));

sagaMiddleware.run(defSaga);

export default store;