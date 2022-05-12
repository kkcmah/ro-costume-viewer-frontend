/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import { UserLoginCreds } from "../../src/types";

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login({username: "myuser", password: "mypass"})
       */
      login(userLoginCreds: UserLoginCreds): Chainable<Element>;
      /**
       * Custom command to bypass the page refresh loading screen
       * @example cy.bypassLoading()
       */
      bypassLoading(): Chainable<Element>;
    }
  }
}
