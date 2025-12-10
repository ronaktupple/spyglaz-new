import Cookies from 'js-cookie';

export interface RefreshResponse {
  access_token: string;
  auth_provider?: string;
  id_token?: string;
  success: boolean;
}

export interface RefreshRequest {
  refresh_token: string;
}

/**
 * Attempts to refresh the access token using the refresh token
 * @param apiBaseUrl - The base URL for the API
 * @param refreshToken - The refresh token to use
 * @returns Promise<RefreshResponse | null> - The refresh response or null if failed
 */
export const refreshAccessToken = async (
  apiBaseUrl: string,
  refreshToken: string
): Promise<RefreshResponse | null> => {

  try {
    const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      } as RefreshRequest),
    });


    if (response.ok) {
      const data: RefreshResponse = await response.json();


      if (data.success && data.access_token) {
        // Update cookies with new tokens
        Cookies.set('access_token', data.access_token, { expires: 1 }); // 1 day
        if (data.id_token) {
          Cookies.set('id_token', data.id_token, { expires: 1 }); // 1 day
        }

        return data;
      }
    }

    console.error('❌ Token refresh failed:', response.status, response.statusText);
    return null;
  } catch (error) {
    console.error('💥 Token refresh error:', error);
    return null;
  }
};

/**
 * Clears all authentication cookies
 */
export const clearAuthCookies = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('id_token');
  Cookies.remove('user_id');
};

/**
 * Creates a custom base query with automatic token refresh
 * @param baseQuery - The original base query function
 * @param apiBaseUrl - The base URL for the API
 * @param store - The Redux store to dispatch actions
 * @returns A base query function with automatic token refresh
 */
export const createBaseQueryWithReauth = (baseQuery: any, apiBaseUrl: string, store?: any) => {
  return async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {

      // Try to get a new token
      const refreshToken = Cookies.get('refresh_token');

      if (refreshToken) {
        const refreshData = await refreshAccessToken(apiBaseUrl, refreshToken);

        if (refreshData) {
          // Retry the original request with new token
          const newHeaders = new Headers();
          newHeaders.set('authorization', `Bearer ${refreshData.access_token}`);

          // Recreate the request with new headers
          if (typeof args === 'string') {
            result = await baseQuery(args, api, extraOptions);
          } else {
            const newArgs = {
              ...args,
              headers: newHeaders,
            };
            result = await baseQuery(newArgs, api, extraOptions);
          }

        } else {
          // If refresh fails, clear cookies and dispatch logout action
          clearAuthCookies();
          if (store) {
            store.dispatch({ type: 'auth/handleTokenRefreshFailure' });
          }
        }
      } else {
        // No refresh token available, clear cookies and dispatch logout action
        clearAuthCookies();
        if (store) {
          store.dispatch({ type: 'auth/handleTokenRefreshFailure' });
        }
      }
    }

    return result;
  };
};
