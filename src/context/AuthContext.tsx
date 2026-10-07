'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'CASHIER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface ShiftInfo {
  id: string | null;
  isOpen: boolean;
  initialAmount: number;
  totalCashSales: number;
  totalDigitalSales: number;
  salesCount: number;
  openedAt: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAdmin: boolean;
  isCashier: boolean;
  isAuthenticated: boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  shift: ShiftInfo;
  setShift: React.Dispatch<React.SetStateAction<ShiftInfo>>;
  openShift: (initialAmount: number) => void;
  closeShift: () => void;
}

const DEFAULT_USERS: Record<UserRole, AuthUser> = {
  CASHIER: {
    id: 'user-caja-01',
    name: 'Cajera Mostrador',
    email: 'cajera@ksera.bo',
    role: 'CASHIER',
    tenantId: 'e9b1b369-2f22-443b-b236-4767117f7eb0',
  },
  ADMIN: {
    id: 'e9b1b369-2f22-443b-b236-4767117f7eb0',
    name: 'Dueño / Administrador',
    email: 'admin@ksera.bo',
    role: 'ADMIN',
    tenantId: 'e9b1b369-2f22-443b-b236-4767117f7eb0',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const INITIAL_SHIFT: ShiftInfo = {
    id: 'shift-live',
    isOpen: true,
    initialAmount: 200,
    totalCashSales: 560,
    totalDigitalSales: 280,
    salesCount: 3,
    openedAt: '2026-01-01T00:00:00.000Z',
  };

  // State with deterministic defaults to prevent hydration mismatch #418
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_USERS.ADMIN);
  const [shift, setShift] = useState<ShiftInfo>(INITIAL_SHIFT);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage only after client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ksera_active_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Elevate cashier to admin so the owner is never locked out or bounced
        if (parsed.role === 'CASHIER') {
          setUser(DEFAULT_USERS.ADMIN);
          localStorage.setItem('ksera_active_user', JSON.stringify(DEFAULT_USERS.ADMIN));
        } else {
          setUser(parsed);
        }
      } else {
        setUser(DEFAULT_USERS.ADMIN);
        localStorage.setItem('ksera_active_user', JSON.stringify(DEFAULT_USERS.ADMIN));
      }

      const savedShift = localStorage.getItem('ksera_cash_shift');
      if (savedShift) {
        const parsed = JSON.parse(savedShift);
        setShift({
          ...parsed,
          salesCount: parsed.salesCount ?? (parsed.totalCashSales > 0 || parsed.totalDigitalSales > 0 ? 3 : 0),
        });
      } else {
        // Initial shift with starter sales so metrics are immediately active
        const defaultShift: ShiftInfo = {
          id: 'shift-live',
          isOpen: true,
          initialAmount: 200,
          totalCashSales: 560,
          totalDigitalSales: 280,
          salesCount: 3,
          openedAt: new Date().toISOString(),
        };
        setShift(defaultShift);
        localStorage.setItem('ksera_cash_shift', JSON.stringify(defaultShift));
      }
    } catch {
      // safe fallback
      setUser(DEFAULT_USERS.ADMIN);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist shift changes only after initial load from storage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('ksera_cash_shift', JSON.stringify(shift));
    }
  }, [shift, isLoaded]);

  // Persist user changes only after initial load from storage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('ksera_active_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('ksera_active_user');
      }
    }
  }, [user, isLoaded]);

  const loginAs = (role: UserRole) => {
    const selected = DEFAULT_USERS[role];
    setUser(selected);
    if (role === 'CASHIER') {
      router.push('/pos');
    } else {
      router.push('/pos');
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  const openShift = (initialAmount: number) => {
    setShift({
      id: `shift-${Date.now()}`,
      isOpen: true,
      initialAmount,
      totalCashSales: 0,
      totalDigitalSales: 0,
      salesCount: 0,
      openedAt: new Date().toISOString(),
    });
  };

  const closeShift = () => {
    setShift((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const role = user?.role || null;
  const isAdmin = role === 'ADMIN';
  const isCashier = role === 'CASHIER';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isCashier,
        isAuthenticated,
        loginAs,
        logout,
        shift,
        setShift,
        openShift,
        closeShift,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
