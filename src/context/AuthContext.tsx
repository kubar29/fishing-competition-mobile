import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { getCurrentUser, loginUser } from '../api/authApi';
import { User } from '../types/user';

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = 'fishing_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function restoreSession() {
    try {
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (!savedToken) {
        return;
      }

      const currentUser = await getCurrentUser(savedToken);

      setToken(savedToken);
      setUser(currentUser);
    } catch (error) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
    });

    await SecureStore.setItemAsync(TOKEN_KEY, response.token);

    setToken(response.token);
    setUser(response.user);
  }

  async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
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

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}