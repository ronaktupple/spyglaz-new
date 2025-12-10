import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout, updateUser } from '@/store/slices/authSlice';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/services/profileApi';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, accessToken } = useAppSelector(state => state.auth);
  
  const { data: profileResponse, isLoading: isProfileLoading, refetch: refetchProfile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated
  });

  const profile = profileResponse?.profile;
  
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleUpdateProfile = async (updates: any) => {
    try {
      await updateProfile(updates).unwrap();
      dispatch(updateUser(updates));
      refetchProfile();
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error };
    }
  };

  return {
    user,
    profile,
    isAuthenticated,
    accessToken,
    isProfileLoading,
    isUpdatingProfile,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    refetchProfile,
  };
};
