import { createStore } from "redux";
import { reducer } from "./Features/reducer.js";
import { saveState, loadState } from "./Features/localStorage.js";

const persistedState = loadState();

const store = createStore(
  reducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
