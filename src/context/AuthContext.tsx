import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { getCurrentUser, setCurrentUser, getData, setData, generateId, avatarColorFor } from '@/lib/storage';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: Omit<User, 'id' | 'avatarColor' | 'createdAt'>) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = getData<User>('users');
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) {
      return { success: false, error: 'Invalid email or password' };
    }
    setCurrentUser(found);
    setUser(found);
    return { success: true };
  }, []);

  const register = useCallback((data: Omit<User, 'id' | 'avatarColor' | 'createdAt'>) => {
    const users = getData<User>('users');
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }
    const newUser: User = {
      ...data,
      id: generateId(),
      avatarColor: avatarColorFor(data.fullName),
      createdAt: new Date().toISOString(),
    };
    setData<User>('users', [...users, newUser]);
    setCurrentUser(newUser);
    setUser(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
