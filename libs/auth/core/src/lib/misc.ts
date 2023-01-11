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
  signupOk: 'Signup successful',
  logoutLoading: 'You are being logged out',
  logoutDone: 'You have been logged out',
  logoutOk: 'Logout successful',
} as const;

export const errmsg = {
  loginFailed: 'Login Failed',
  loginIncorrect: 'Incorrect username/email or password',
  signupFailed: 'Signup Failed',
  logoutFailed: 'Logout Failed',
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
