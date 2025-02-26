// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // Profile endpoints
  PROFILE: {
    CHECK_USERNAME: (username: string) => `${API_URL}/api/profile/check-username/${username}`,
    GET: (id: string) => `${API_URL}/api/profile/${id}`,
    UPDATE: `${API_URL}/api/profile/update`,
  },
} as const;

// Fetch wrapper with error handling
export async function fetchApi<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
