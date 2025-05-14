// lib/api.ts
import Cookies from "js-cookie";

// Base URL for all API requests
const API_BASE_URL = "https://c9server.go.ro/messaging-api";

/**
 * Get the current logged-in user from localStorage
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
}

/**
 * Get the JWT token from cookies
 */
export function getToken() {
  return Cookies.get("token") || null;
}

/**
 * API client for making authenticated requests
 */
export const api = {
  /**
   * Make a GET request
   */
  get: async (endpoint: string) => {
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
    
    return response.json();
  },
  
  /**
   * Make a POST request
   */
  post: async (endpoint: string, data: any) => {
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
        errorMessage = errorJson.message || `User or password is incorrect!`;
      } catch (e) {
        errorMessage = errorText || `User or password is incorrect!`;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  },
  
  /**
   * Make a PUT request
   */
  put: async (endpoint: string, data: any) => {
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
    
    return response.json();
  },
  
  /**
   * Make a DELETE request
   */
  delete: async (endpoint: string) => {
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
    
    return response.json();
  },
};

/**
 * Authentication functions
 */
export const auth = {
  /**
   * Login user
   */
  login: async (username: string, password: string) => {
    const data = await api.post("/login", { username, password });
    
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
   * Logout user
   */
  logout: () => {
    // Remove token
    Cookies.remove("token");
    
    // Remove user from localStorage
    localStorage.removeItem("user");
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!getToken() && !!getCurrentUser();
  },
};