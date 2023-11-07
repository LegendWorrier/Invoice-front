import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
// import { persistStore, persistReducer } from 'redux-persist';

// import storage from 'redux-persist/lib/storage';
// ==============================|| REDUX - MAIN STORE ||============================== //

// const persistConfig = {
//     key: 'root', // The key for the persisted data in storage
//     storage, // The storage engine to use
//   };

// const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(reducer,
    applyMiddleware(thunk));
// const store = createStore(reducer);
const persister = 'Free';

export { store, persister };

// export const store = createStore(persistedReducer, 
//      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
// export const persistor = persistStore(store);
// export default store
// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer from './reducer';

// const store = createStore(rootReducer, applyMiddleware(thunk));

// export default store;