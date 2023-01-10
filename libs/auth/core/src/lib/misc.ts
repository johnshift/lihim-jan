export const subjects = {
  firstname: 'Firstname',
  lastname: 'Lastname',
  username: 'Username',
  email: 'Email',
  password: 'Password',
} as const;

export const lengths = {
  name: { min: 2, max: 32 },
  principal: { min: 4, max: 32 },
  password: { min: 6, max: 64 },
} as const;

export const regex = {
  name: /^[A-Z][a-z]*$/,
  username: /^[A-Za-z][\dA-Za-z-]*$/,
} as const;

export const urls = {
  session: '/api/auth/session',
} as const;

export const texts = {
  login: 'Login',
  loginFooter: "Dont't have an account?",
  signup: 'Sign Up',
  logout: 'Logout',
} as const;

export const names = {
  principal: 'principal',
  password: 'password',
} as const;

export const labels = {
  principal: 'Username / Email',
  password: 'Password',
} as const;

export const placeholders = {
  principal: 'hello@lihim.app',
  password: 'super-secure-password',
} as const;

export const aria = {
  submitLogin: 'Submit login',
} as const;

export const testid = {
  loginFooterLink: 'login-footer-link',
  loginLoadingOverlay: 'login-loading-overlay',
} as const;
