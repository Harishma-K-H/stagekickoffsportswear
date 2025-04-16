import { RootState } from '@redux/rootReducer';
import { createDraftSafeSelector } from '@reduxjs/toolkit';

const selectDomain = (state: RootState) => state.auth;

export const selectUserName = createDraftSafeSelector(
  [selectDomain],
  (authState) => authState?.userName,
);

export const selectAccessToken = createDraftSafeSelector(
  [selectDomain],
  (authState) => authState?.accessToken,
);

export const selectRefreshToken = createDraftSafeSelector(
  [selectDomain],
  (authState) => authState?.refreshToken,
);

export const selectUserRole = createDraftSafeSelector(
  [selectDomain],
  (authState) => authState?.userRole,
);

export const selectBranchDetails = createDraftSafeSelector(
  [selectDomain],
  (authState) => authState?.branchDetails,
);
