import { AuthState } from '@models/Reducer';
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState: AuthState = {
  accessToken: null,
  userId: null,
  userData: null,
  userRole: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload;
      state.userData = jwtDecode(action.payload);
    },
    setUserIdAndRole: (state, action) => {
      state.userId = action.payload?.id;
      state.userRole = action.payload?.role;
    },
    resetUser: (state) => {
      localStorage.clear();
      state.accessToken = null;
      state.userId = null;
      state.userData = null;
      state.userRole = null;
    },
  },
});

export const { setToken, setUserIdAndRole, resetUser } = authSlice.actions;
export default authSlice.reducer;
