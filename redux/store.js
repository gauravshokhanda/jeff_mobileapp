import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authReducer from './slice/authSlice';
import contractorReducer from "./slice/contractorsSlice"
import polygonReducer from "./slice/polygonSlice"
import breakdownCostSlice from "./slice/breakdownCostSlice"

// Persist Config
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

// Root Reducer
const rootReducer = combineReducers({
    auth: authReducer,
    contractorsList: contractorReducer,
    polygon: polygonReducer,
    breakdownCost: breakdownCostSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store Configuration
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// Persistor
const persistor = persistStore(store);

export { store, persistor };
