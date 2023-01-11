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
