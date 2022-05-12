/// <reference types="cypress" />

describe("The Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.bypassLoading();
  });

  it("displays login page with form", () => {
    cy.get("h3").should("have.text", "Login");
    cy.contains("No account?");
    cy.get("[data-cy=login-username-input]").should("exist");
    cy.get("[data-cy=login-password-input]").should("exist");
    cy.get("[data-cy=login-btn]").should("be.disabled");
  });

  it("focusing and leaving username blank shows required error", () => {
    // have to select child div then input in order to use focus and blur
    cy.get("[data-cy=login-username-input] > div > input").focus().blur();
    cy.contains("Required").should("exist");
  });

  it("focusing and leaving password blank shows required error", () => {
    // have to select child div then input in order to use focus and blur
    cy.get("[data-cy=login-password-input] > div > input").focus().blur();
    cy.contains("Required").should("exist");
  });

  it("clicking on sign up link goes to sign up page", () => {
    cy.get("[data-cy=signup-link]").click();
    cy.get("h3").should("have.text", "Sign Up");
  });

  describe("logging in", () => {
    beforeEach(() => {
      cy.request("POST", "/api/testing/resetUsers");
      cy.request("POST", "/api/users", {
        username: "existing",
        password: "existing",
      });
    });

    it("succeeds when entering valid credentials", () => {
      cy.get("[data-cy=login-username-input]").type("existing");
      cy.get("[data-cy=login-password-input]").type("existing");
      cy.get("[data-cy=login-btn]")
        .click()
        .should(() => {
          // test localstorage contains user
          expect(localStorage.getItem("user")).to.not.be.null;
        });
      // check login page is no longer being shown
      cy.get("[data-cy=login-username-input]").should("not.exist");
      cy.get("[data-cy=login-password-input]").should("not.exist");
      cy.get("[data-cy=login-btn]").should("not.exist");
      cy.url().should("not.include", "/login");
      // check header changed from showing login/signup buttons to profile and log out buttons
      cy.get("[data-cy=header-login-btn]").should("not.exist");
      cy.get("[data-cy=header-signup-btn]").should("not.exist");
      cy.get("[data-cy=header-profile-btn]").should("exist");
      cy.get("[data-cy=header-logout-btn]").should("exist");
    });

    it("fails when entering invalid password for existing user", () => {
      cy.get("[data-cy=login-username-input]").type("existing");
      cy.get("[data-cy=login-password-input]").type("wrongpass");
      cy.get("[data-cy=login-btn]").click();
      cy.contains("invalid username or password").should("exist");
    });

    it("fails when entering credentials for non existing user", () => {
      cy.get("[data-cy=login-username-input]").type("idontexist");
      cy.get("[data-cy=login-password-input]").type("password");
      cy.get("[data-cy=login-btn]").click();
      cy.contains("invalid username or password").should("exist");
    });
  });
});
