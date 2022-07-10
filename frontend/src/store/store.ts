/* eslint-disable no-unused-vars */
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {userSlice} from './user';
import {errorSlice} from './error';
import {editorSlice} from './editor';

export const store = configureStore({
  reducer: combineReducers({
    user: userSlice.reducer,
    error: errorSlice.reducer,
    editor: editorSlice.reducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;
