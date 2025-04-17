import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);  //  Store user info if needed

    // Load user data from localStorage on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to update token and persist to localStorage
    const updateToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

      // Function to update user and persist
      const updateUserInfo = (newUserInfo) => {
        setUser(newUserInfo);
        if (newUserInfo) {
            localStorage.setItem('user', JSON.stringify(newUserInfo));
        } else {
            localStorage.removeItem('user');
        }
    };

    const authContextValue = {
        token,
        updateToken,
        updateUserInfo,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };  