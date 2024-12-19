import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.token = action.payload.access_token;
            state.isAuthenticated = true
        },
        setLogout: (state, action) => (
            state.token = null,
            state.isAuthenticated = false
        )
    },
});

export const { setLogin, setLogout } = authSlice.actions;

export default authSlice.reducer;
