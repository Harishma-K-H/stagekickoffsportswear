import { AuthState } from '@models/Reducer';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AuthState = {
  refreshToken: null,
  accessToken: null,
  userName: null,
  userRole: null,
  branchDetails: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.refreshToken = action.payload.refresh;
      state.accessToken = action.payload.access;
    },
    setUserName: (state, action) => {
      state.userName = action.payload.name;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setBranchDetails: (state, action) => {
      state.branchDetails = {
        ...action.payload,
      };
    },
    resetUser: (state) => {
      localStorage.clear();
      state.refreshToken = null;
      state.accessToken = null;
      state.userName = null;
      state.userRole = null;
    },
  },
});

export const {
  setToken,
  setUserName,
  setUserRole,
  resetUser,
  setBranchDetails,
} = authSlice.actions;
export default authSlice.reducer;
