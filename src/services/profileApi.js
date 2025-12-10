import { getAuthToken } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update current user profile
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.first_name - User's first name
 * @param {string} profileData.last_name - User's last name
 * @param {string} profileData.organization - User's organization
 * @param {string} profileData.role - User's role
 * @returns {Promise<Object>} Updated profile data
 */
export const updateProfile = async (profileData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Upload profile avatar
 * @param {File} avatarFile - Avatar image file
 * @returns {Promise<Object>} Upload response with avatar URL
 */
export const uploadAvatar = async (avatarFile) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};
