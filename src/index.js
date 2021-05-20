import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import TmsReducer from './tms-main/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from "redux";

const middleware = [ thunk ];
 
const store = createStore(
  combineReducers({ TmsReducer }),
  composeWithDevTools(applyMiddleware(...middleware))
); 
ReactDOM.render(
  <Provider store={store}>    
    <React.StrictMode>
      <App /> 
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')  
); 

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
