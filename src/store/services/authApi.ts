import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { createBaseQueryWithReauth } from '../../utils/tokenRefresh';
import { logCORSInfo, getCORSRecommendations } from '../../utils/corsDebug';

// Use proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : ' https://hh5rtx2y64lilivkyrqf72vrba0cnrht.lambda-url.us-east-1.on.aws';

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

// Enhanced base query with better error handling for CORS issues
const enhancedBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);
    return result;
  } catch (error: any) {
    // Log CORS info for debugging
    logCORSInfo();
    
    // Handle CORS and network errors specifically
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      const recommendations = getCORSRecommendations();
      return {
        error: {
          status: 'CORS_ERROR',
          error: 'CORS policy blocked the request. This is likely due to server configuration.',
          details: error.message,
          recommendations,
        },
      };
    }
    
    // Handle other network errors
    if (error.name === 'TypeError') {
      return {
        error: {
          status: 'NETWORK_ERROR',
          error: 'Network request failed. Please check your connection.',
          details: error.message,
        },
      };
    }
    
    // Re-throw other errors
    throw error;
  }
};

const baseQueryWithReauth = createBaseQueryWithReauth(enhancedBaseQuery, API_BASE_URL, (globalThis as any).__REDUX_STORE__);

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  auth_provider: string;
  id_token: string;
  refresh_token: string;
  success: boolean;
  user_id: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  company: string;
  permissions?: string[];
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  id_token: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    signup: builder.mutation<{ message: string }, SignupRequest>({
      query: (userData) => ({
        url: '/auth/admin/register',
        method: 'POST',
        body: {
          username: userData.email,
          password: userData.password,
          role: 'user',
          permissions: ['email_drafting', 'producer_management', 'analytics', 'strategy_planning'],
        },
      }),
    }),
    
    getProfile: builder.query<UserProfile, void>({
      query: () => '/profile/me',
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (updates) => ({
        url: '/profile/me',
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
    
    refreshToken: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (refreshData) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: refreshData,
      }),
    }),
    
    getMe: builder.query<any, void>({
      query: () => '/auth/me',
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
} = authApi;
