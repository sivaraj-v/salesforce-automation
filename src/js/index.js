import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/index.scss';
import React from 'react';
import { render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { renderRoutes } from 'react-router-config';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import route_configuration from './route_configuration';
import store from './store';
const AppRouter = () => {
  return (
    <Provider store={store} basename="/">
      <BrowserRouter>
        {renderRoutes(route_configuration)}
      </BrowserRouter>
    </Provider>
  )
}
//  basename="/svs-printers-and-bags/dist/"
// store.dispatch({
//   type: "ADD",
//   payload: 22
// });
// store.dispatch({
//   type: "SUBTRACT",
//   payload: 80
// });
// store.dispatch({
//   type: "SET_AGE",
//   payload: 30
// });
var SW_Enabled = false;
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', {
      scope: '/'
    }).then(function(serviceReg) {
      if ('pushManager' in serviceReg) {
        console.log(1);
      } else {
        console.log(0);
      }
      if (serviceReg.installing) {
        console.log('Service worker installing');
      } else if (serviceReg.waiting) {
        console.log('Service worker installed');
      } else if (serviceReg.active) {
        SW_Enabled = true;
        console.log('Service worker active');
      }

      // Check for showNotification support.
      if (!(serviceReg.showNotification)) {
        console.log('Notifications aren\'t supported on service workers.');
      } else {
        console.log('Notifications are supported on service workers.');
        serviceWorker.addEventListener("statechange", function(e) {
          console.log("sw statechange : ", e.target.state);
          if (e.target.state == "activated") {
            // use pushManger for subscribing here.
            console.log("Just now activated. now we can subscribe for push notification")
          }
        });
        serviceReg.pushManager.subscribe({
          userVisibleOnly: true
        });
      }
    }).catch(function(error) {
      // registration failed
      if (!SW_Enabled) {
        console.log('Registration failed with ' + error);
      }

    });
    Notification.requestPermission(function(result) {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
          registration.showNotification('Notification with ServiceWorker');
        });
      }
    });
  });
}
render(<AppRouter />, document.querySelector('#app'));

