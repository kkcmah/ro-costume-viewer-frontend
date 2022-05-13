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
    cy.get("[data-cy=signup-username-input]").as("signupUsernameInput");
    cy.get("[data-cy=signup-password-input]").as("signupPasswordInput");
    cy.get("[data-cy=signup-btn]").as("signupBtn");
  });

  it("displays sign up page with form", () => {
    cy.get("h3").should("have.text", "Sign Up");
    cy.contains("Existing account?");
    cy.get("@signupUsernameInput").should("exist");
    cy.get("@signupPasswordInput").should("exist");
    cy.get("@signupBtn").should("be.disabled");
  });

  it("entering invalid usernames shows appropriate validation errors", () => {
    // have to select child div then input in order to use focus and blur
    cy.get("@signupUsernameInput").find("div > input").focus().blur();
    cy.contains("Required").should("exist");
    cy.get("@signupUsernameInput").find("div > input").type("a").blur();
    cy.contains("username must be between 3 - 50 characters").should("exist");
    // test 51 character string
    cy.get("@signupUsernameInput")
      .find("div > input")
      .clear()
      .type("Lorem ipsum dolor sit amet, consectetur porta ante.")
      .blur();
    cy.contains("username must be between 3 - 50 characters").should("exist");
  });

  it("entering invalid passwords shows appropriate validation errors", () => {
    cy.get("@signupPasswordInput").find("div > input").focus().blur();
    cy.contains("Required").should("exist");
    cy.get("@signupPasswordInput").find("div > input").type("a").blur();
    cy.contains("password must be longer than 3 characters").should("exist");
  });

  it("clicking on login link goes to login page", () => {
    cy.get("[data-cy=login-link]").click();
    cy.get("h3").should("have.text", "Login");
  });

  describe("Signing up", () => {
    beforeEach(() => {
      cy.request("POST", "/api/testing/resetUsers");
      cy.request("POST", "/api/users", {
        username: "existing",
        password: "existing",
      });
    });

    it("succeeds when using a username that doesn't already exist", () => {
      cy.get("@signupUsernameInput").type("newuser");
      cy.get("@signupPasswordInput").type("password");
      cy.get("@signupBtn").click();
      cy.contains("Account created!").should("exist");
      // clicking proceed to login page goes to login page
      cy.get("[data-cy=proceed-login-btn]").should("exist").click();
      cy.get("h3").should("have.text", "Login");
      cy.get("[data-cy=login-username-input]").should("exist");
      cy.get("[data-cy=login-password-input]").should("exist");
      cy.get("[data-cy=login-btn]").should("be.disabled");
    });

    it("fails when using a username that already exists", () => {
      cy.get("@signupUsernameInput").type("existing");
      cy.get("@signupPasswordInput").type("password");
      cy.get("@signupBtn").click();
      cy.contains("username must be unique").should("exist");
      cy.contains("Account created!").should("not.exist");
    });
  });
});
