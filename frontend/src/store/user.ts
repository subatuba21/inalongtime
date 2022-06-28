import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authAPI, LoginInput} from '../api/auth';

export interface UserState {
    firstName: string;
    lastName: string;
    email: string;
    loggedIn: boolean;
}

const initialState: UserState = {
  firstName: '',
  lastName: '',
  email: '',
  loggedIn: false,
};

export const login = createAsyncThunk('users/login',
    async (credentials: LoginInput, thunkAPI) => {
      const result = await authAPI.login(credentials);
      return result;
    });

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logout: (state: UserState) => {
      state = initialState;
      authAPI.logout();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload.success) {
        state = {
          email: action.payload.user?.email as string,
          firstName: action.payload.user?.firstName as string,
          lastName: action.payload.user?.lastName as string,
          loggedIn: true,
        };
      }
    });
  },
});

export const {logout} = userSlice.actions;


