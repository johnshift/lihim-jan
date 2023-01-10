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
  login: '/api/auth/login',
} as const;

export const texts = {
  login: 'Login',
  loginFooter: "Dont't have an account?",
  signup: 'Sign Up',
  signupFooter: 'Already have an account?',
  logout: 'Logout',
} as const;

export const aria = {
  submitLogin: 'Submit login',
  submitSignup: 'Submit signup',
} as const;

export const testid = {
  loginFooterLink: 'login-footer-link',
  loginLoadingOverlay: 'login-loading-overlay',
  signupFooterLink: 'signup-footer-link',
  signupLoadingOverlay: 'signup-loading-overlay',
} as const;

export const msg = {
  loginOk: 'Login successful',
  loginOkInfo: 'You are now logged in',
} as const;

export const errmsg = {
  loginFailed: 'Login Failed',
  loginIncorrect: 'Incorrect username/email or password',
} as const;

export const inputProps = {
  principal: {
    name: 'principal',
    label: 'Username / Email',
    placeholder: 'jopay@kmusta.kna',
  },
  firstname: {
    name: 'firstname',
    label: 'First Name',
    placeholder: 'Jane',
  },
  lastname: {
    name: 'lastname',
    label: 'Last Name',
    placeholder: 'Doe',
  },
  username: {
    name: 'username',
    label: 'Username',
    placeholder: 'jopay',
  },
  email: {
    name: 'email',
    label: 'Email',
    placeholder: 'kamusta@ka.na',
  },
  password: {
    name: 'password',
    label: 'Password',
    placeholder: 'wag-ka-nang-mawala',
  },
};
