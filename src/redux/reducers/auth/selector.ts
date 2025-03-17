import { RootState } from '@redux/rootReducer';
import { createDraftSafeSelector } from '@reduxjs/toolkit';

const selectDomain = (state: RootState) => state.auth;

export const selectUserData = createDraftSafeSelector(
  [selectDomain],
  (authState) => authState?.userData,
);
export const selectAccessToken = createDraftSafeSelector(
  [selectDomain],
  (authState) => authState?.accessToken,
);
export const selectUserId = createDraftSafeSelector(
  [selectDomain],
  (authState) => authState?.userId,
);
export const selectUserRole = createDraftSafeSelector(
  [selectDomain],
  (authState) => authState?.userRole,
);
