// Attributes
export const LABEL_FIRSTNAME = 'First Name';
export const LABEL_LASTNAME = 'Last Name';
export const LABEL_USERNAME = 'Username';
export const LABEL_EMAIL = 'Email';
export const LABEL_PASSWORD = 'Password';

// Lengths
export const MIN_LENGTH_NAME = 2;
export const MAX_LENGTH_NAME = 32;
export const MIN_LENGTH_PRINCIPAL = 4;
export const MAX_LENGTH_PRINCIPAL = 32;
export const MIN_LENGTH_PASSWORD = 6;
export const MAX_LENGTH_PASSWORD = 64;

// Regex
export const RGX_NAME = /^[A-Za-z]*$/;
export const RGX_USERNAME = /^[A-Za-z][\dA-Za-z-]*$/;

// Urls
export const API_URL_SESSION = '/api/auth/session';
export const API_URL_LOGIN = '/api/auth/login';
export const API_URL_LOGOUT = '/api/auth/logout';
export const API_URL_SIGNUP = '/api/auth/signup';

// String literals
export const TEXT_LOGIN = 'Login';
export const TEXT_LOGIN_FOOTER = "Don't have an account?";
export const TEXT_SIGNUP = 'Signup';
export const TEXT_SIGNUP_FOOTER = 'Already have an account?';
export const TEXT_LOGOUT = 'Logout';

// Attributes
export const ARIA_SUBMIT_LOGIN = 'Submit login';
export const ARIA_SUBMIT_SIGNUP = 'Submit signup';
export const TESTID_LOGIN_LINK = 'login-link';
export const TESTID_LOGIN_LOADING = 'login-loading';
export const TESTID_SIGNUP_LINK = 'signup-link';
export const TESTID_SIGNUP_LOADING = 'signup-loading';

// Messages
export const MSG_LOGIN_OK = 'Login successful';
export const MSG_LOGIN_OK_INFO = 'You are now logged in';
export const MSG_SIGNUP_OK = 'Signup successful';
export const MSG_LOGOUT_LOADING = 'You are being logged out';
export const MSG_LOGOUT_DONE = ' You have been logged out';
export const MSG_LOGOUT_OK = 'Logout successful';
