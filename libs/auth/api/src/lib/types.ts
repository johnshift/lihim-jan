export type SupabaseAccessToken = {
  aud: string;
  exp: number;
  sub: string;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  user_metadata: {};
  role: string;
};

export type TGetSessionInfoArgs = {
  emailInput: string;
};

export type TGetEmailArgs = {
  principal: string;
};

export type TSignupPreflightArgs = {
  usernameInput: string;
  emailInput: string;
};

export type TSignupPreflightResponse = {
  usernameTaken: boolean;
  emailTaken: boolean;
};
