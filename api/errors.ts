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

export const registerValidationError : APIError = {
  // eslint-disable-next-line max-len
  message: 'Validation failed. Please check your email, password, and other fields are correct and try again.',
  code: StatusCodes.BAD_REQUEST,
};

export const unknownRegisterError : APIError = {
  message: 'Unable to register user. Please try again later.',
  code: StatusCodes.INTERNAL_SERVER_ERROR,
};

export const alreadySignedUp : APIError = {
  message: 'Looks like you\'re already registered. Please log in.',
  code: StatusCodes.CONFLICT,
};
