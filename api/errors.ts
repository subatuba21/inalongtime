import {StatusCodes} from 'http-status-codes';

export interface APIError {
    message: string;
    code: StatusCodes
}


export const passwordTooShort : APIError = {
  message: 'Password must be at least 8 characters long',
  code: StatusCodes.UNPROCESSABLE_ENTITY,
};

export const emailInvalid : APIError = {
  message: 'Please provide a valid email',
  code: StatusCodes.UNPROCESSABLE_ENTITY,
};

export const credentialsInvalid : APIError = {
  message: 'Your email or password is incorrect.',
  code: StatusCodes.UNAUTHORIZED,
};

export const unknownError : APIError = {
  message: 'Unknown error. Please try again later.',
  code: StatusCodes.INTERNAL_SERVER_ERROR,
};
