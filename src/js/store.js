import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension';
import { mathReducer, userReducer, loader } from "./modules";
export const combine = combineReducers({
  SO_Creation: mathReducer,
  user: userReducer,
  loader : loader
});
export const store = createStore(
  combine,
  {},
  composeWithDevTools(
    applyMiddleware(createLogger())
  )
);

// store.subscribe(() => {
//   console.log(store.getState());
// });
// console.log(store.getState());



export default store;

