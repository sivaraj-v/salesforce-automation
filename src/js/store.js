import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension';
import { mathReducer, userReducer } from "./modules";
const combine = combineReducers({
  SO_Creation: mathReducer,
  user: userReducer
});
const store = createStore(
  combine,
  {},
  composeWithDevTools(
    applyMiddleware(createLogger()),
    // other store enhancers if any
  )
);

// store.subscribe(() => {
//   console.log(store.getState());
// });

export default store;

