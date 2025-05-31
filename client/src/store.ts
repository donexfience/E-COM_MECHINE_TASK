import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/Api/AuthApiSlice";
import authReducer from "./features/auth/authSlice";
import productReducer from "./features/product/productSlice";
import { setupInterceptors } from "./services/axiosInstance";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { productApi } from "./services/Api/productApiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  [api.reducerPath]: api.reducer,
  [productApi.reducerPath]: productApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["product"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware, productApi.middleware),
});

export const persistor = persistStore(store);

setupInterceptors(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
