import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { createBaseQueryWithReauth } from '../../utils/tokenRefresh';
import { logCORSInfo, getCORSRecommendations } from '../../utils/corsDebug';

// Use proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://hh5rtx2y64lilivkyrqf72vrba0cnrht.lambda-url.us-east-1.on.aws';

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
const enhancedBaseQuery = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);
    return result;
  } catch (error) {
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

const baseQueryWithReauth = createBaseQueryWithReauth(enhancedBaseQuery, API_BASE_URL, globalThis.__REDUX_STORE__);

export const agentApi = createApi({
  reducerPath: 'agentApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Non-streaming chat
    chat: builder.mutation({
      query: (chatData) => ({
        url: '/agent/chat',
        method: 'POST',
        body: { ...chatData, stream: false },
      }),
    }),
    
    // Get chat sessions
    getSessions: builder.query({
      query: () => '/agent/sessions',
    }),
    
    // Get specific session
    getSession: builder.query({
      query: (sessionId) => `/agent/sessions/${sessionId}`,
    }),
    
    // Delete session
    deleteSession: builder.mutation({
      query: (sessionId) => ({
        url: `/agent/sessions/${sessionId}`,
        method: 'DELETE',
      }),
    }),
    
    // Get user data
    getUserData: builder.query({
      query: () => '/agent/data',
    }),
  }),
});

export const {
  useChatMutation,
  useGetSessionsQuery,
  useGetSessionQuery,
  useDeleteSessionMutation,
  useGetUserDataQuery,
} = agentApi;
