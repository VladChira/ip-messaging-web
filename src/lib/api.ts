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

export interface Chat {
  chatId: string;
  name: string;
  chatType: string;
  createdAt: string;
}

export interface Message {
  messageId: string,
  chatId: string,
  senderId: number,
  text: string,
  sentAt: string,
}

export interface ChatMember {
  userId: number,
  chatId: string,  // Fixed typo: was "charId"
  joinedAt: string,
  lastReadMessageId?: string,
  lastReadAt?: string
}

export type ChatDetail = {
  members: UserData[];
  messages: Message[];
  chatMembers: ChatMember[]; // Add this to track read status
};

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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || `Username or password is incorrect!`;
      } catch {
        // Using empty catch block to avoid unused variable
        errorMessage = errorText || `Username or password is incorrect!`;
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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    const data = await api.post<LoginResponse, LoginCredentials>("/login", {
      username,
      password,
    });

    // Store the JWT token in HTTP cookies
    Cookies.set("token", data.token, {
      expires: 7, // 7 days
      secure: false,
      sameSite: "Lax",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict"
    });

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  /**
   * Register a new user
   */
  register: async (
    userData: RegisterCredentials
  ): Promise<RegisterResponse> => {
    const data = await api.post<RegisterResponse, RegisterCredentials>(
      "/register",
      userData
    );
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
      await api.delete<{ success: boolean }>("/users/delete-account");

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

// Friend Request related interfaces
export interface FriendRequestData {
  requestId: number;
  senderId: number;
  receiverId: number;
  status: string;
  createdAt: string;
}

export interface UserSearchResult {
  userId: number;
  name: string;
  username: string;
  requestSent: boolean;
}

export interface FriendRequestsResponse {
  friendRequests: {
    requestId: number;
    userId: number;
    name: string;
    username: string;
    createdAt: string;
  }[];
}

// Friend request functions
export const friends = {
  /**
   * Search for users to add as friends
   */
  searchUsers: async (
    query: string
  ): Promise<{ users: UserSearchResult[] }> => {
    return api.get(`/search-users?query=${encodeURIComponent(query)}`);
  },

  /**
   * Send a friend request to another user
   */
  sendFriendRequest: async (
    recipientId: number
  ): Promise<{ message: string }> => {
    return api.post("/send-friend-request", { recipient_id: recipientId });
  },

  /**
   * Get pending friend requests for the current user
   */
  getFriendRequests: async (): Promise<FriendRequestsResponse> => {
    return api.get("/get-friend-requests");
  },

  /**
   * Accept or reject a friend request
   */
  respondToFriendRequest: async (
    requestId: number,
    action: "accept" | "reject"
  ): Promise<{ message: string }> => {
    return api.post("/respond-to-friend-request", {
      request_id: requestId,
      action,
    });
  },

  /**
   * Get all friends of the current user
   */
  getFriends: async (): Promise<{ friends: UserData[] }> => {
    const currentUser = getCurrentUser();
    if (!currentUser?.userId) {
      throw new Error("User not authenticated");
    }
    return api.get(`/get-friends-by-user-id/${currentUser.userId}`);
  },
};

// Chat related functions
export const chats = {
  /**
   * Get all chats for the current user
   */
  getChats: async (): Promise<{ chats: Chat[] }> => {
    return api.get("/get-chats");
  },

  /**
   * Get messages for a specific chat
   */
  getMessages: async (chatId: string): Promise<{ messages: Message[] }> => {
    return api.get(`/get-messages/${chatId}`);
  },

  /**
   * Get members for a specific chat
   */
  getMembers: async (chatId: string): Promise<{ members: UserData[] }> => {
    return api.get(`/get-members/${chatId}`);
  },

  /**
   * Mark messages as read up to a specific message ID
   */
  markAsRead: async (chatId: string, messageId: string): Promise<{ success: boolean }> => {
    return api.post("/mark-as-read", { chatId, messageId });
  },

  /**
   * Get unread counts for all chats
   */
  getUnreadCounts: async (): Promise<{ unreadCounts: Record<string, number>, totalUnread: number }> => {
    return api.get("/unread-counts");
  },
};