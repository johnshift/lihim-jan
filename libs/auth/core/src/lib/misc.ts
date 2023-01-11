import type { LoginPayload } from './schemas/login-payload-schema';
import type { SignupPayload } from './schemas/signup-payload-schema';
import {
  LABEL_EMAIL,
  LABEL_FIRSTNAME,
  LABEL_LASTNAME,
  LABEL_PASSWORD,
  LABEL_PRINCIPAL,
  LABEL_USERNAME,
  NAME_EMAIL,
  NAME_FIRSTNAME,
  NAME_LASTNAME,
  NAME_PASSWORD,
  NAME_PRINCIPAL,
  NAME_USERNAME,
  PLACEHOLDER_EMAIL,
  PLACEHOLDER_FIRSTNAME,
  PLACEHOLDER_LASTNAME,
  PLACEHOLDER_PASSWORD,
  PLACEHOLDER_PRINCIPAL,
  PLACEHOLDER_USERNAME,
} from './constants';

type CommonInputProps = {
  label: string;
  placeholder: string;
};

type SignupInputProps = {
  name: keyof SignupPayload;
} & CommonInputProps;

type LoginInputProps = {
  name: keyof LoginPayload;
} & CommonInputProps;

export const nameInputs: SignupInputProps[] = [
  {
    name: NAME_FIRSTNAME,
    label: LABEL_FIRSTNAME,
    placeholder: PLACEHOLDER_FIRSTNAME,
  },
  {
    name: NAME_LASTNAME,
    label: LABEL_LASTNAME,
    placeholder: PLACEHOLDER_LASTNAME,
  },
];

export const credentialInputs: SignupInputProps[] = [
  {
    name: NAME_USERNAME,
    label: LABEL_USERNAME,
    placeholder: PLACEHOLDER_USERNAME,
  },
  {
    name: NAME_EMAIL,
    label: LABEL_EMAIL,
    placeholder: PLACEHOLDER_EMAIL,
  },
  {
    name: NAME_PASSWORD,
    label: LABEL_PASSWORD,
    placeholder: PLACEHOLDER_PASSWORD,
  },
];

export const loginInputs: LoginInputProps[] = [
  {
    name: NAME_PRINCIPAL,
    label: LABEL_PRINCIPAL,
    placeholder: PLACEHOLDER_PRINCIPAL,
  },
  {
    name: NAME_PASSWORD,
    label: LABEL_PASSWORD,
    placeholder: PLACEHOLDER_PASSWORD,
  },
];
