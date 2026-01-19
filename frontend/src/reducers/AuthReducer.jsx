export const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true
};

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false
            };
        case 'STOP_LOADING':
            return {
                ...state,
                loading: false
            };
        default:
            return state;
    }
};