import { createContext, useReducer, useEffect } from 'react';
import { authReducer, initialState } from '../reducers/AuthReducer';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                dispatch({ type: 'LOGIN_SUCCESS', payload: decoded });
            } catch (err) {
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
            }
        } else {
            dispatch({ type: 'STOP_LOADING' });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: decoded });
    };

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};