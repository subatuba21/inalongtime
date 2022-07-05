/* eslint-disable no-unused-vars */
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {userSlice} from './user';
import {errorSlice} from './error';

export const store = configureStore({
  reducer: combineReducers({
    user: userSlice.reducer,
    error: errorSlice.reducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;
