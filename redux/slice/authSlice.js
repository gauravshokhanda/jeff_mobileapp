import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSignUp: (state, action) => {
            state.token = action.payload.access_token;
            state.isAuthenticated = true
            state.user = action.payload.user || null;
        },
        setLogin: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true
            state.user = action.payload.user;
        },
        setLogout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
        }
    },
});

export const { setLogin, setLogout, setSignUp } = authSlice.actions;
export default authSlice.reducer;
