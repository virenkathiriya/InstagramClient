import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import authReducer from './store/reducers/auth'
import postReducer from './store/reducers/posts'

import registerServiceWorker from './registerServiceWorker';

const composeEnhancers = ( window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const rootReducer = combineReducers({
    auth: authReducer,
    post: postReducer
})
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
const app = (
    <Provider store={store}>
        <App/>
    </Provider>
);

ReactDOM.render(app , document.getElementById('root'));
registerServiceWorker();
