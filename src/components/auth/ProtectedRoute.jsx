import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { initializeFromCookies } from '@/store/slices/authSlice.js';
import Cookies from 'js-cookie';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, accessToken } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    // Check if we have tokens in cookies but not in Redux state
    const cookieAccessToken = Cookies.get('access_token');
    const cookieUserId = Cookies.get('user_id');


    // Validate that we have valid string values
    if (cookieAccessToken && cookieUserId &&
      typeof cookieAccessToken === 'string' &&
      typeof cookieUserId === 'string' &&
      cookieAccessToken.length > 0 &&
      cookieUserId.length > 0 &&
      !isAuthenticated) {
      // We have valid tokens in cookies, restore the authentication state
      dispatch(initializeFromCookies());
    } else {
    }

    // Mark initialization as complete
    setIsInitializing(false);
  }, [dispatch, isAuthenticated]);

  // Check if we have an access token (either in Redux state or cookies)
  const hasValidToken = accessToken || (Cookies.get('access_token') && Cookies.get('user_id'));

  // Additional safety check - ensure user_id is not empty string
  const hasValidUserId = Cookies.get('user_id') && Cookies.get('user_id') !== '';


  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!hasValidToken || !hasValidUserId) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
