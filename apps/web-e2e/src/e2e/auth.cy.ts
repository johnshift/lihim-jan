import { ERR_EMAIL_TAKEN, ERR_USERNAME_TAKEN } from '@lihim/auth/core';
import {
  ARIA_SUBMIT_LOGIN,
  ARIA_SUBMIT_SIGNUP,
  ERR_SIGNUP_FAILED,
  MSG_LOGIN_OK,
  MSG_LOGIN_OK_INFO,
  MSG_LOGOUT_DONE,
  MSG_LOGOUT_OK,
  MSG_SIGNUP_OK,
  NAME_EMAIL,
  NAME_FIRSTNAME,
  NAME_LASTNAME,
  NAME_PASSWORD,
  NAME_PRINCIPAL,
  NAME_USERNAME,
  TESTID_SIGNUP_LINK,
} from '@lihim/auth/core';
import { fakeSignupPayload } from '@lihim/auth/testutils';
import { ARIA_HEADER_MENU, TESTID_AUTH_MENUITEM } from '@lihim/shared/core';

import { click, input, select } from '../support/helpers';

describe('auth', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // Since tests for auth depend on previous step,
  // we want cypress to failfast if any step failed
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      // @ts-expect-error Property runnner is not exposed by Cypress
      Cypress.runner.stop();
    }
  });

  const payload = fakeSignupPayload();

  it('should signup user', () => {
    // Open menu
    click('aria-label', ARIA_HEADER_MENU);

    // Open auth modal
    click('data-testid', TESTID_AUTH_MENUITEM);

    // Open signup form
    click('data-testid', TESTID_SIGNUP_LINK);

    // Fill in details
    input(NAME_FIRSTNAME, payload.firstname);
    input(NAME_LASTNAME, payload.lastname);
    input(NAME_USERNAME, payload.username);
    input(NAME_EMAIL, payload.email);
    input(NAME_PASSWORD, payload.password);

    // Submit
    click('aria-label', ARIA_SUBMIT_SIGNUP);

    // Wait for loading to disappear
    select('data-loading', '').should('not.exist');

    // Assert signup success indicators
    cy.contains(MSG_SIGNUP_OK).should('be.visible');
    cy.contains(`Welcome ${payload.firstname}!`).should('be.visible');

    // Logout
    click('aria-label', ARIA_HEADER_MENU);
    click('data-testid', TESTID_AUTH_MENUITEM);

    // Assert logout success indicators
    cy.contains(MSG_LOGOUT_OK).should('be.visible');
    cy.contains(MSG_LOGOUT_DONE).should('be.visible');
  });

  it('should login using email then logout', () => {
    // Open menu
    click('aria-label', ARIA_HEADER_MENU);

    // Open auth modal
    click('data-testid', TESTID_AUTH_MENUITEM);

    // Fill in details (uppercased email to ensure case-insensitivity)
    input(NAME_PRINCIPAL, payload.email.toUpperCase());
    input(NAME_PASSWORD, payload.password);

    // Submit
    click('aria-label', ARIA_SUBMIT_LOGIN);

    // Wait for loading to disappear
    select('data-loading', '').should('not.exist');

    // Assert success indicators
    cy.contains(MSG_LOGIN_OK).should('be.visible');
    cy.contains(MSG_LOGIN_OK_INFO).should('be.visible');

    // Logout
    click('aria-label', ARIA_HEADER_MENU);
    click('data-testid', TESTID_AUTH_MENUITEM);

    // Assert logout success indicators
    cy.contains(MSG_LOGOUT_OK).should('be.visible');
    cy.contains(MSG_LOGOUT_DONE).should('be.visible');
  });

  it('should login using username then logout', () => {
    // Open menu
    click('aria-label', ARIA_HEADER_MENU);

    // Open auth modal
    click('data-testid', TESTID_AUTH_MENUITEM);

    // Fill in details (uppercased email to ensure case-insensitivity)
    input(NAME_PRINCIPAL, payload.username.toUpperCase());
    input(NAME_PASSWORD, payload.password);

    // Submit
    click('aria-label', ARIA_SUBMIT_LOGIN);

    // Wait for loading to disappear
    select('data-loading', '').should('not.exist');

    // Assert success indicators
    cy.contains(MSG_LOGIN_OK).should('be.visible');
    cy.contains(MSG_LOGIN_OK_INFO).should('be.visible');

    // Logout
    click('aria-label', ARIA_HEADER_MENU);
    click('data-testid', TESTID_AUTH_MENUITEM);

    // Assert logout success indicators
    cy.contains(MSG_LOGOUT_OK).should('be.visible');
    cy.contains(MSG_LOGOUT_DONE).should('be.visible');
  });

  it('username taken error', () => {
    // Open menu
    click('aria-label', ARIA_HEADER_MENU);

    // Open auth modal
    click('data-testid', TESTID_AUTH_MENUITEM);

    // Open signup form
    click('data-testid', TESTID_SIGNUP_LINK);

    // Fill in details
    input(NAME_FIRSTNAME, payload.firstname);
    input(NAME_LASTNAME, payload.lastname);
    input(NAME_USERNAME, payload.username);
    input(NAME_EMAIL, payload.email);
    input(NAME_PASSWORD, payload.password);

    // Submit
    click('aria-label', ARIA_SUBMIT_SIGNUP);

    // Wait for loading to disappear
    select('data-loading', '').should('not.exist');

    // Assert success indicators
    cy.contains(ERR_SIGNUP_FAILED).should('be.visible');
    cy.contains(ERR_USERNAME_TAKEN).should('be.visible');
  });

  it('email taken error', () => {
    // Open menu
    click('aria-label', ARIA_HEADER_MENU);

    // Open auth modal
    click('data-testid', TESTID_AUTH_MENUITEM);

    // Open signup form
    click('data-testid', TESTID_SIGNUP_LINK);

    // Fill in details
    input(NAME_FIRSTNAME, payload.firstname);
    input(NAME_LASTNAME, payload.lastname);
    input(NAME_USERNAME, payload.username + 'x');
    input(NAME_EMAIL, payload.email);
    input(NAME_PASSWORD, payload.password);

    // Submit
    click('aria-label', ARIA_SUBMIT_SIGNUP);

    // Wait for loading to disappear
    select('data-loading', '').should('not.exist');

    // Assert success indicators
    cy.contains(ERR_SIGNUP_FAILED).should('be.visible');
    cy.contains(ERR_EMAIL_TAKEN).should('be.visible');
  });
});
