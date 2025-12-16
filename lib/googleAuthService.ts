const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface GoogleAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      picture?: string;
    };
    token: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

class GoogleAuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'GoogleAuthError';
  }
}

// Initialize Google Sign-In
export const initGoogleSignIn = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new GoogleAuthError('Window is not defined'));
      return;
    }

    // Check if script is already loaded
    if (window.google?.accounts) {
      resolve();
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new GoogleAuthError('Failed to load Google Sign-In script'));
    
    document.body.appendChild(script);
  });
};

// Handle Google Sign-In
export const signInWithGoogle = (): Promise<GoogleAuthResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      await initGoogleSignIn();

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        reject(new GoogleAuthError('Google Client ID is not configured'));
        return;
      }

      // Type guard to ensure window.google exists
      if (!window.google?.accounts?.id) {
        reject(new GoogleAuthError('Google Sign-In not initialized'));
        return;
      }

      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            // Send the credential to your backend
            const result = await verifyGoogleToken(response.credential);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        error_callback: (error: any) => {
          reject(new GoogleAuthError('Google Sign-In failed', undefined, [
            { field: 'google', message: error.message || 'Authentication failed' }
          ]));
        }
      });

      // Type guard before calling prompt
      if (!window.google?.accounts?.id) {
        reject(new GoogleAuthError('Google Sign-In not available'));
        return;
      }

      // Prompt the user to sign in
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Type guard before rendering button
          if (!window.google?.accounts?.id) {
            return;
          }

          // Fallback to popup if prompt is not displayed
          const hiddenBtn = document.createElement('div');
          hiddenBtn.id = 'g_id_signin_hidden';
          hiddenBtn.style.display = 'none';
          document.body.appendChild(hiddenBtn);
          
          window.google.accounts.id.renderButton(hiddenBtn, {
            theme: 'filled_black',
            size: 'large',
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Verify Google token with your backend
const verifyGoogleToken = async (credential: string): Promise<GoogleAuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ credential }),
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw new GoogleAuthError('Invalid response from server', response.status);
    }

    if (!response.ok) {
      throw new GoogleAuthError(
        data.message || 'Google authentication failed',
        response.status,
        data.errors
      );
    }

    // Store token and user info
    if (data.success && data.data?.token) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  } catch (error) {
    if (error instanceof GoogleAuthError) {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new GoogleAuthError('Network error. Please check your connection.');
    }
    throw new GoogleAuthError('An unexpected error occurred');
  }
};

// One-tap Google Sign-In (optional - shows Google popup automatically)
export const showGoogleOneTap = async (): Promise<void> => {
  try {
    await initGoogleSignIn();
    
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('Google Client ID is not configured');
      return;
    }

    // Type guard to ensure window.google exists
    if (!window.google?.accounts?.id) {
      console.error('Google Sign-In not initialized');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: any) => {
        try {
          await verifyGoogleToken(response.credential);
        } catch (error) {
          console.error('Google One-Tap failed:', error);
        }
      },
    });

    // Type guard before calling prompt
    if (!window.google?.accounts?.id) {
      console.error('Google Sign-In not available');
      return;
    }

    window.google.accounts.id.prompt();
  } catch (error) {
    console.error('Failed to show Google One-Tap:', error);
  }
};

// Type definitions for Google Sign-In
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

export { GoogleAuthError };
export type { GoogleAuthResponse };