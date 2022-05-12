/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("The Sign Up Page", () => {
  beforeEach(() => {
    cy.visit("/signup");
    cy.bypassLoading();
  });

  it("displays sign up page with form", () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get("h1").should("have.text", "Sign Up");
    cy.contains("Existing account?");
    cy.get("[data-cy=username-input]").should("exist");
    cy.get("[data-cy=password-input").should("exist");
    cy.get("[data-cy=signup-btn]").should("be.disabled");
  });
});
