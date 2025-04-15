
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import axios from "axios";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set up axios defaults for authentication
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("vjtiExamsToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Set base URL for API calls
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = apiBaseUrl;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored user and token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("vjtiExamsToken");
      const storedUser = localStorage.getItem("vjtiExamsUser");
      
      if (storedToken && storedUser) {
        try {
          // Validate token by making a request to the backend
          // This would be replaced with a real validation endpoint
          // const response = await axios.get("/api/auth/validate");
          // if (response.status === 200) {
          setCurrentUser(JSON.parse(storedUser));
          // }
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem("vjtiExamsToken");
          localStorage.removeItem("vjtiExamsUser");
          setCurrentUser(null);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call
      // const response = await axios.post("/api/login", { email, password });
      // const { user, token } = response.data;
      
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        const user: User = {
          id: "user123",
          name: email.split('@')[0],
          email: email,
          avatar: `https://i.pravatar.cc/150?u=${email}`
        };
        
        const token = "mock-jwt-token";
        
        setCurrentUser(user);
        localStorage.setItem("vjtiExamsUser", JSON.stringify(user));
        localStorage.setItem("vjtiExamsToken", token);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call
      // const response = await axios.post("/api/register", { name, email, password });
      // const { user, token } = response.data;
      
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const user: User = {
        id: "user" + Date.now(),
        name,
        email,
        avatar: `https://i.pravatar.cc/150?u=${email}`
      };
      
      const token = "mock-jwt-token";
      
      setCurrentUser(user);
      localStorage.setItem("vjtiExamsUser", JSON.stringify(user));
      localStorage.setItem("vjtiExamsToken", token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // This would include any cleanup needed on the server side
    setCurrentUser(null);
    localStorage.removeItem("vjtiExamsUser");
    localStorage.removeItem("vjtiExamsToken");
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
