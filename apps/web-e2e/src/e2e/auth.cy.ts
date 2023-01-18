import { ARIA_HEADER_MENU } from '@lihim/shared/core';

import { click } from '../support/helpers';

describe('auth', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // Since tests for auth depend on previous step,
  // we want cypress to failfast if any steps failed
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      // @ts-expect-error Property runnner is not exposed by Cypress
      Cypress.runner.stop();
    }
  });

  it('should register user', () => {
    click('aria-label', ARIA_HEADER_MENU);

    cy.pause();
  });
});
