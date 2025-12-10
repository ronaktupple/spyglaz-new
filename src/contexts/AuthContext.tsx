import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  company: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login for demo purposes
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email: email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        // avatar intentionally unset until user uploads/chooses one
        role: 'Sales Manager',
        company: 'Acme Insurance Co.'
      };
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful signup
    if (name && email && password) {
      const mockUser: User = {
        id: '1',
        email: email,
        name: name,
        // avatar intentionally unset until user uploads/chooses one
        role: 'Sales Representative',
        company: 'Acme Insurance Co.'
      };
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    }
  };

  // Check for stored user on initialization
  React.useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};