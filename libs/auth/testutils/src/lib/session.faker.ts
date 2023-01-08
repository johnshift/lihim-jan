import { faker } from '@faker-js/faker';

import type { Session } from '@lihim/auth/core';

export const fakeSession = (isAnon = false): Session => ({
  id: faker.datatype.uuid(),
  avatar: faker.image.people(40, 40, true),
  email: faker.internet.email(),
  username: faker.internet.domainWord(),
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  isAnon,
});
