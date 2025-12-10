import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/authApi.js';
import { agentApi } from './services/agentApi.js';
import { profileApi } from './services/profileApi.js';
import authReducer, { initializeFromCookies } from './slices/authSlice.js';
import Cookies from 'js-cookie';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      agentApi.middleware,
      profileApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});
(globalThis as any).__REDUX_STORE__ = store;

// Initialize authentication from cookies if they exist
// Note: This runs before React components mount, so we need to be careful
// about when we dispatch actions
const accessToken = Cookies.get('access_token');
const userId = Cookies.get('user_id');



// Validate that we have valid data before proceeding
if (accessToken && userId && typeof accessToken === 'string' && typeof userId === 'string') {
} else {
  // Clear any invalid cookies
  if (accessToken && !userId) {
    console.warn('Access token found but no user_id, clearing invalid token');
    Cookies.remove('access_token');
  }
  if (userId && !accessToken) {
    console.warn('User ID found but no access token, clearing invalid user_id');
    Cookies.remove('user_id');
  }
}



setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
