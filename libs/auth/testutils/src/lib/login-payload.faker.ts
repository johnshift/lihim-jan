import { faker } from '@faker-js/faker';

import type { LoginPayload } from '@lihim/auth/core';

export const fakeLoginPayload = (useEmail = true): LoginPayload => ({
  principal: useEmail ? faker.internet.email() : faker.lorem.slug(2),
  password: faker.internet.password(),
});
