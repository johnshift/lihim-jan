// Attributes
export const LABEL_FIRSTNAME = 'First Name';
export const LABEL_LASTNAME = 'Last Name';
export const LABEL_USERNAME = 'Username';
export const LABEL_EMAIL = 'Email';
export const LABEL_PASSWORD = 'Password';
export const LABEL_PRINCIPAL = 'Username / Email';
export const NAME_FIRSTNAME = 'firstname';
export const NAME_LASTNAME = 'lastname';
export const NAME_USERNAME = 'username';
export const NAME_EMAIL = 'email';
export const NAME_PASSWORD = 'password';
export const NAME_PRINCIPAL = 'principal';
export const PLACEHOLDER_FIRSTNAME = 'Jane';
export const PLACEHOLDER_LASTNAME = 'Doe';
export const PLACEHOLDER_USERNAME = 'jopay';
export const PLACEHOLDER_EMAIL = 'kamusta@ka.na';
export const PLACEHOLDER_PASSWORD = 'wag-ka-nang-mawala';
export const PLACEHOLDER_PRINCIPAL = 'jopay@kmusta.kna';

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
export const TEXT_LOGOUT_TITLE = 'Confirm Action';
export const TEXT_LOGOUT_SUBTITLE = 'Are you sure you want to logout?';

// Attributes
export const ARIA_SUBMIT_LOGIN = 'Submit login';
export const ARIA_SUBMIT_SIGNUP = 'Submit signup';
export const TESTID_LOGIN_LINK = 'login-link';
export const TESTID_LOGIN_LOADING = 'login-loading';
export const TESTID_SIGNUP_LINK = 'signup-link';
export const TESTID_SIGNUP_LOADING = 'signup-loading';
export const TESTID_LOGIN_SKELETON = 'login-skeleton';
export const TESTID_SIGNUP_SKELETON = 'signup-skeleton';
export const TESTID_LOGOUT_LOADING = 'logout-loading';

// Messages
export const MSG_LOGIN_OK = 'Login successful';
export const MSG_LOGIN_OK_INFO = 'You are now logged in';
export const MSG_SIGNUP_OK = 'Signup successful';
export const MSG_LOGOUT_LOADING = 'You are being logged out';
export const MSG_LOGOUT_DONE = 'You have been logged out';
export const MSG_LOGOUT_OK = 'Logout successful';

// Error Messages
export const ERR_LOGIN_FAILED = 'Login Failed';
export const ERR_LOGIN_INCORRECT = 'Incorrect username/email or password';
export const ERR_SIGNUP_FAILED = 'Signup Failed';
export const ERR_LOGOUT_FAILED = 'Logout Failed';
export const ERR_EMAIL_TAKEN = 'Email address is already taken';
export const ERR_USERNAME_TAKEN = 'Username is already taken';
