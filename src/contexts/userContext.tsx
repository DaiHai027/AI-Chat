import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {ReactNode} from 'react';

type User = {
    sub: string;
    name?: string;
    email?: string;
    picture?: string;
    family_name?: string;
    given_name?: string;
};

type UserContextType = {
    user: User | null;
    setUserData: (userData: User) => void;
    clearUserData: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Avoid SSR issues by checking if window is defined
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data from localStorage", error);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        }
    }, [user]);

    const setUserData = useCallback((userData: User) => {
        setUser(userData);
    }, []);

    const clearUserData = useCallback(() => {
        setUser(null);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUserData, clearUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};