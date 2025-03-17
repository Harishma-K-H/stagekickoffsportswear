import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './reducers/auth/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
