import {authAPI, LoginInput, RegisterInput} from '../api/auth';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserState {
  _id: string,
    firstName: string;
    lastName: string;
    email: string;
    loggedIn: boolean;
}

const initialState: UserState = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  loggedIn: false,
};

export const login = createAsyncThunk('user/login',
    async (credentials: LoginInput, thunkAPI) => {
      const result = await authAPI.login(credentials);
      return result;
    });

export const register = createAsyncThunk('user/register',
    async (info: RegisterInput, thunkAPI) => {
      const result = await authAPI.register(info);
      return result;
    });

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state: UserState) => {
      state.loggedIn = false;
      state._id = '';
      state.email = '';
      state.firstName = '';
      state.lastName = '';
      authAPI.logout();
    },

    setUserState: (state: UserState, action : PayloadAction<UserState>) => {
      state.loggedIn = action.payload.loggedIn;
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (_state, action) => {
      if (action.payload.success) {
        return {
          _id: action.payload.user?._id as string,
          email: action.payload.user?.email as string,
          firstName: action.payload.user?.firstName as string,
          lastName: action.payload.user?.lastName as string,
          loggedIn: true,
        };
      }
    });

    builder.addCase(register.fulfilled, (_state, action) => {
      if (action.payload.success) {
        return {
          _id: action.payload.user?._id as string,
          email: action.payload.user?.email as string,
          firstName: action.payload.user?.firstName as string,
          lastName: action.payload.user?.lastName as string,
          loggedIn: true,
        };
      }
    });
  },
});

export const {logout, setUserState} = userSlice.actions;


