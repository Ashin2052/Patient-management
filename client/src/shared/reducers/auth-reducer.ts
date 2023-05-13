import {createSlice, Draft} from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: !!localStorage.getItem('accessToken'),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state:Draft<any>, action) => {
            state.isLoggedIn = true
            localStorage.setItem('accessToken',action.payload.accessToken);
            localStorage.setItem('refreshToken',action.payload.refreshToken);
            localStorage.setItem('userInfo',action.payload.userInfo);
        },
        logout: (state:Draft<any>) => {
            state.isLoggedIn = false;
            localStorage.clear();
        }
    }
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;