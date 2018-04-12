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
render(<AppRouter />, document.querySelector('#app'));

