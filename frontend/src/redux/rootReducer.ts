import { combineReducers } from '@reduxjs/toolkit';
import layoutSlice from './slices/layoutSlice';
import gameSlice from './slices/gameSlice';
import vfxSlice from './slices/vfxSlice';
import engineSlice from './slices/engineSlice';
import authSlice from './slices/authSlice';
import chaosSlice from './slices/chaosSlice';

const combinedReducer = combineReducers({
  authSlice,
  engineSlice,
  layoutSlice,
  gameSlice,
  vfxSlice,
  chaosSlice,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'STORE_RESET') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export default rootReducer;
