
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("vjtiExamsUser");
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Mock authentication functions for frontend
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        const user: User = {
          id: "user123",
          name: email.split('@')[0],
          email: email,
          avatar: `https://i.pravatar.cc/150?u=${email}`
        };
        
        setCurrentUser(user);
        localStorage.setItem("vjtiExamsUser", JSON.stringify(user));
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const user: User = {
        id: "user" + Date.now(),
        name,
        email,
        avatar: `https://i.pravatar.cc/150?u=${email}`
      };
      
      setCurrentUser(user);
      localStorage.setItem("vjtiExamsUser", JSON.stringify(user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem("vjtiExamsUser");
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
