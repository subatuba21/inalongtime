import axios, {AxiosError} from 'axios';
import {CentralError, CentralErrors} from '../store/error';

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginResult {
    success: boolean;
    user?: {
        email: string;
        firstName: string;
        lastName: string;
        _id: string;
        method?: string;
    };
}

export interface LogoutResult {
    success: boolean;
}

export interface RegisterInput {
  email: string,
  password: string,
  firstname: string,
  lastname: string,
}


export interface RegisterResult extends LoginResult {
  error?: CentralError
}

export const authAPI = {
  login: async (credentials: LoginInput): Promise<LoginResult> => {
    try {
      const res = await axios({
        method: 'post',
        url: '/api/auth/login',
        data: credentials,
      });

      if (res.status===200) {
        return {
          success: true,
          user: {
            email: res.data.data.email,
            firstName: res.data.data.firstname,
            lastName: res.data.data.lastname,
            _id: res.data.data._id,
            method: res.data.data.method,
          },
        };
      }
    } catch (err) {}
    return {
      success: false,
    };
  },

  logout: async () : Promise<LogoutResult> => {
    const res = await axios({
      method: 'post',
      url: '/api/auth/logout',
    });
    return {
      success: (res.status===200),
    };
  },

  register: async (info : RegisterInput) : Promise<RegisterResult> => {
    try {
      const res = await axios({
        method: 'post',
        url: '/api/auth/register',
        data: {
          data: info,
        },
      });

      if (res.status===200) {
        return {
          success: true,
          user: {
            email: res.data.data.email,
            firstName: res.data.data.firstname,
            lastName: res.data.data.lastname,
            _id: res.data.data._id,
            method: res.data.data.method,
          },
        };
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const axerr = err as AxiosError;
        return {
          success: false,
          error: {
            type: CentralErrors.signupError,
            message: (axerr.response as any).data?.error?.message ??
            'Unknown error while signing up. Please try again later.',
          },
        };
      }
    }

    return {
      success: false,
      error: {
        type: CentralErrors.signupError,
        message: 'Unknown error while signing up. Please try again.',
      },
    };
  },

  getCurrentUser: async () : Promise<LoginResult> => {
    try {
      const res = await axios({
        method: 'get',
        url: '/api/auth/current',
      });

      if (res.status===200 && res.data.data!=null) {
        return {
          success: true,
          user: {
            email: res.data.data.email,
            firstName: res.data.data.firstname,
            lastName: res.data.data.lastname,
            _id: res.data.data._id,
            method: res.data.data.method,
          },
        };
      }
    } catch (err) {}

    return {
      success: false,
    };
  },
};

export const getAuthApi = () => authAPI;
