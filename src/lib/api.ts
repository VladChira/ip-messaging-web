// lib/api.ts
import Cookies from "js-cookie";

// Define proper types to avoid 'any'
export interface UserData {
  userId: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

// Base URL for all API requests
const API_BASE_URL = "https://c9server.go.ro/messaging-api";

/**
 * Get the current logged-in user from localStorage
 */
export function getCurrentUser(): UserData | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as UserData;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
}

/**
 * Get the JWT token from cookies
 */
export function getToken(): string | null {
  return Cookies.get("token") || null;
}

/**
 * API client for making authenticated requests
 */
export const api = {
  /**
   * Make a GET request
   */
  get: async <T>(endpoint: string): Promise<T> => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  /**
   * Make a POST request
   */
  post: async <T, D>(endpoint: string, data: D): Promise<T> => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || `API error: ${response.status}`;
      } catch {
        // Using empty catch block to avoid unused variable
        errorMessage = errorText || `API error: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json() as Promise<T>;
  },
  
  /**
   * Make a PUT request
   */
  put: async <T, D>(endpoint: string, data: D): Promise<T> => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  /**
   * Make a DELETE request
   */
  delete: async <T>(endpoint: string): Promise<T> => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  },
};

// Login credentials interface
interface LoginCredentials {
  username: string;
  password: string;
}

// Login response interface
interface LoginResponse {
  token: string;
  user: UserData;
}

// Register credentials interface
interface RegisterCredentials {
  username: string;
  name: string;
  email: string;
  password: string;
}

// Register response interface
interface RegisterResponse {
  message: string;
  user: UserData;
}

/**
 * Authentication functions
 */
export const auth = {
  /**
   * Login user
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const data = await api.post<LoginResponse, LoginCredentials>("/login", { username, password });
    
    // Store the JWT token in HTTP cookies
    Cookies.set("token", data.token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" 
    });
    
    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  },
  
  /**
   * Register a new user
   */
  register: async (userData: RegisterCredentials): Promise<RegisterResponse> => {
    const data = await api.post<RegisterResponse, RegisterCredentials>("/register", userData);
    return data;
  },
  
  /**
   * Logout user
   */
  logout: () => {
    // Remove token
    Cookies.remove("token");
    
    // Remove user from localStorage
    localStorage.removeItem("user");
  },
  
  /**
   * Delete the user's account
   */
  deleteAccount: async (): Promise<void> => {
    try {
      // Call the API to delete the account
      await api.delete<{ success: boolean }>('/users/delete-account');
      
      // Clear authentication data
      Cookies.remove("token");
      localStorage.removeItem("user");
      
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to delete account:", error);
      return Promise.reject(error);
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!getToken() && !!getCurrentUser();
  },
};