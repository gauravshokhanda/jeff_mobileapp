import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSignUp: (state, action) => {
            state.token = action.payload.access_token;
            state.isAuthenticated = true
        },
        setLogin: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true
        },
        setLogout: (state) => {
            state.token = null;
            state.isAuthenticated = false
        }
    },
});

export const { setLogin, setLogout, setSignUp } = authSlice.actions;
export default authSlice.reducer;
