import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
// Firebase Context
import Firebase, { FirebaseContext } from './server'
// Session Context
import { initialState } from './session/initState'
import { SessionStateProvider } from './session/sessionStore'
import { mainReducer } from './session/reducers'

const firebaseInstance = new Firebase()

ReactDOM.render(
<FirebaseContext.Provider value={firebaseInstance}>
  <SessionStateProvider initialState={initialState} reducer={mainReducer}>
    <App />
  </SessionStateProvider>
</FirebaseContext.Provider>
, document.getElementById('root'));

if(firebaseInstance.messaginValidation.isSupported()) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
