import { getAuthToken } from '../utils/auth';
import { config } from '../config/env';

const API_BASE_URL = config.api.baseUrl;

/**
 * Get chat sessions for the current user
 * @returns {Promise<Object>} Chat sessions data
 */
export const getChatSessions = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
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
    console.error('Error fetching chat sessions:', error);
    throw error;
  }
};

/**
 * Get a specific chat session by session ID
 * @param {string} sessionId - The session ID to fetch
 * @returns {Promise<Object>} Chat session data
 */
export const getChatSession = async (sessionId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
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
    console.error('Error fetching chat session:', error);
    throw error;
  }
};

/**
 * Update a chat session title
 * @param {string} sessionId - The session ID to update
 * @param {string} title - The new title for the session
 * @returns {Promise<Object>} Updated chat session data
 */
export const updateChatSession = async (sessionId, title) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating chat session:', error);
    throw error;
  }
};

/**
 * Delete a chat session
 * @param {string} sessionId - The session ID to delete
 * @returns {Promise<Object>} Delete operation result
 */
export const deleteChatSession = async (sessionId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}?confirm=true`, {
      method: 'DELETE',
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
    console.error('Error deleting chat session:', error);
    throw error;
  }
};
