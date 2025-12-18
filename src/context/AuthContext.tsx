import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getApiKey, setApiKey as storeApiKey, clearApiKey as removeApiKey, resetApiClient } from '../api/client';

interface AuthContextType {
  apiKey: string | null;
  isAuthenticated: boolean;
  login: (key: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const login = (key: string) => {
    storeApiKey(key);
    setApiKey(key);
    resetApiClient();
  };

  const logout = () => {
    removeApiKey();
    setApiKey(null);
    resetApiClient();
  };

  return (
    <AuthContext.Provider
      value={{
        apiKey,
        isAuthenticated: !!apiKey,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

