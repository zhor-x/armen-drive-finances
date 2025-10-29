import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api, { setAuthToken } from "../api";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean; // ⬅️ added
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ⬅️ added

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setAuthToken(token);
      } catch {
        localStorage.removeItem("user_data");
      }
    }

    setLoading(false); // ⬅️ done loading
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post("/login", { email, password });
      localStorage.setItem("access_token", data.data.token);
      localStorage.setItem("refresh_token", data.data.refresh_token);
      localStorage.setItem("user_data", JSON.stringify(data.data.user));
      setAuthToken(data.data.token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
