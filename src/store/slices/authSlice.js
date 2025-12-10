import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  user: null,
  isAuthenticated: false,
  accessToken: Cookies.get('access_token') || null,
  refreshToken: Cookies.get('refresh_token') || null,
  idToken: Cookies.get('id_token') || null,
  hasSeenActionPrompts: false,
};

// Helper function to safely create user object
const createSafeUser = (user_id, username, role, permissions) => {

  const safeUserId = user_id || '';
  const safeUsername = username || (user_id && typeof user_id === 'string' && user_id.length > 0 ? user_id.split('@')[0] : 'user');


  return {
    id: safeUserId,
    email: safeUserId,
    username: safeUsername,
    role: role || 'user',
    permissions: permissions || [],
    avatar: undefined, // No avatar by default
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access_token, refresh_token, id_token, user_id, username, role, permissions } = action.payload;

      if (!access_token || !user_id || typeof access_token !== 'string' || typeof user_id !== 'string') {
        console.error('setCredentials: Invalid parameters provided', { access_token, user_id });
        return;
      }

      // Store tokens in cookies
      Cookies.set('access_token', access_token, { expires: 1 }); // 1 day
      Cookies.set('refresh_token', refresh_token, { expires: 30 }); // 30 days
      Cookies.set('id_token', id_token, { expires: 1 }); // 1 day
      Cookies.set('user_id', user_id, { expires: 30 }); // 30 days

      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      state.idToken = id_token;
      state.isAuthenticated = true;

      state.user = createSafeUser(user_id, username, role, permissions);

    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('id_token');
      Cookies.remove('user_id');

      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.idToken = null;
      state.hasSeenActionPrompts = false;
    },

    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      Cookies.set('access_token', action.payload, { expires: 1 });
    },

    handleTokenRefreshFailure: (state) => {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('id_token');
      Cookies.remove('user_id');

      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.idToken = null;
      state.hasSeenActionPrompts = false;

    },

    initializeFromCookies: (state) => {
      const accessToken = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');
      const idToken = Cookies.get('id_token');
      const userId = Cookies.get('user_id');

      if (accessToken && userId && typeof accessToken === 'string' && typeof userId === 'string' && accessToken.length > 0 && userId.length > 0) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken || null;
        state.idToken = idToken || null;
        state.isAuthenticated = true;

        state.user = createSafeUser(userId, undefined, 'user', []);

      } else if (accessToken && !userId) {

        console.warn('Access token found but no user_id cookie. Cannot restore full authentication state.');
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('id_token');
      } else {
        console.log('accessToken:', accessToken, 'userId:', userId, 'types:', typeof accessToken, typeof userId);
      }
    },

    markActionPromptsSeen: (state) => {
      state.hasSeenActionPrompts = true;
    },

    resetActionPrompts: (state) => {
      state.hasSeenActionPrompts = false;
    },
  },
});

export const { setCredentials, setUser, logout, updateUser, setAccessToken, handleTokenRefreshFailure, initializeFromCookies, markActionPromptsSeen, resetActionPrompts } = authSlice.actions;
export default authSlice.reducer;
