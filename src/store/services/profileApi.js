import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { createBaseQueryWithReauth } from '../../utils/tokenRefresh';

// Use proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://hh5rtx2y64lilivkyrqf72vrba0cnrht.lambda-url.us-east-1.on.aws';

// Custom base query with automatic token refresh
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = Cookies.get('access_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = createBaseQueryWithReauth(baseQuery, API_BASE_URL, globalThis.__REDUX_STORE__);

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Get current user profile
    getProfile: builder.query({
      query: () => '/profile/me',
    }),
    
    // Update current user profile
    updateProfile: builder.mutation({
      query: (updates) => ({
        url: '/profile/me',
        method: 'PUT',
        body: updates,
      }),
    }),
    
    // Update user preferences
    updatePreferences: builder.mutation({
      query: (preferences) => ({
        url: '/profile/preferences',
        method: 'PUT',
        body: preferences,
      }),
    }),
    
    // Get all users (admin only)
    getUsers: builder.query({
      query: () => '/profile/users',
    }),
    
    // Update user permissions (admin only)
    updateUserPermissions: builder.mutation({
      query: ({ userId, permissions }) => ({
        url: `/profile/permissions`,
        method: 'PUT',
        body: { user_id: userId, permissions },
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePreferencesMutation,
  useGetUsersQuery,
  useUpdateUserPermissionsMutation,
} = profileApi;
