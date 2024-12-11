import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { clearAuthState } from './slices/authSlice';

const persistConfig = {
  key: 'auth',
  storage,
  blacklist: ['isLoading', 'error'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store);

// Function to check cookies and reset state if necessary
export const checkCookiesAndState = async () => {
  const cookies: Record<string, string> = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value || '';
      return acc;
    }, {} as Record<string, string>);

  if (!cookies['refreshToken']) {
    store.dispatch(clearAuthState());
    localStorage.clear();
    await persistor.purge();
  }
};

checkCookiesAndState();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;