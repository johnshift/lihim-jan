import { faker } from '@faker-js/faker';

import type { SignupPayload } from '@lihim/auth/core';

export const fakeSignupPayload = (): SignupPayload => ({
  firstname: faker.lorem.word({ length: { min: 4, max: 16 } }),
  lastname: faker.lorem.word({ length: { min: 4, max: 16 } }),
  username: faker.lorem.slug(2),
  email: faker.internet.email(),
  password: faker.internet.password(16),
});
