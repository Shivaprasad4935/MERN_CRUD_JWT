import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);  

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const updateToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

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

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };  