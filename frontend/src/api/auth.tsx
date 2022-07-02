import axios from 'axios';

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
    };
}

export interface LogoutResult {
    success: boolean;
}

export const authAPI = {
  login: async (credentials: LoginInput): Promise<LoginResult> => {
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
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
        },
      };
    } else {
      return {
        success: false,
      };
    }
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
};
