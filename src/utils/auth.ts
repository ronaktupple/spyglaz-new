import Cookies from 'js-cookie';

export interface LoginResponse {
  access_token: string;
  auth_provider: string;
  id_token: string;
  refresh_token: string;
  success: boolean;
  user_id: string;
}

export const setAuthTokens = (response: LoginResponse) => {
  // Set tokens in cookies
  Cookies.set('access_token', response.access_token, { expires: 1 }); // 1 day
  Cookies.set('refresh_token', response.refresh_token, { expires: 30 }); // 30 days
  Cookies.set('id_token', response.id_token, { expires: 1 }); // 1 day
  
  // Store user info
  Cookies.set('user_id', response.user_id, { expires: 30 });
  
  return response;
};

export const clearAuthTokens = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('id_token');
  Cookies.remove('user_id');
};

export const getAuthTokens = () => {
  return {
    access_token: Cookies.get('access_token'),
    refresh_token: Cookies.get('refresh_token'),
    id_token: Cookies.get('id_token'),
    user_id: Cookies.get('user_id'),
  };
};

export const isAuthenticated = (): boolean => {
  const accessToken = Cookies.get('access_token');
  return !!accessToken;
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get('access_token');
};
