/// <reference types="cypress" />

describe("The Header", () => {
  describe("for non-logged in users", () => {
    beforeEach(() => {
      cy.visit("/notexist");
      cy.bypassLoading();
    });

    describe("nav menu icon appears for viewport of 500 x 800", () => {
      beforeEach(() => {
        cy.viewport(500, 800);
      });

      it("has a home item", () => {
        cy.get("[data-cy=header-menu-btn-xs]").should("exist").click();
        cy.get("[data-cy=header-menu-home-xs]").should("exist").click();
        cy.url().should("include", "/");
      });

      it("has a sets item", () => {
        cy.get("[data-cy=header-menu-btn-xs]").should("exist").click();
        cy.get("[data-cy=header-menu-sets-xs]").should("exist").click();
        cy.url().should("include", "/sets");
      });
    });

    it("has a home button", () => {
      cy.get("[data-cy=header-home-btn]").should("exist").click();
      cy.url().should("include", "/");
    });

    it("has a sets button", () => {
      cy.get("[data-cy=header-sets-btn]").should("exist").click();
      cy.url().should("include", "/sets");
    });

    it("has a theme switch", () => {
      // test clicking theme switch changes header color
      // assume it starts on dark mode
      cy.get("header").should(
        "have.css",
        "background-color",
        "rgb(33, 36, 70)"
      );
      cy.get("[data-cy=header-theme-switch]").should("exist").click();
      cy.get("header").should(
        "have.css",
        "background-color",
        "rgb(80, 105, 138)"
      );
    });

    it("has a login button", () => {
      cy.get("[data-cy=header-login-btn]").should("exist").click();
      cy.url().should("include", "/login");
    });

    it("has a sign up button", () => {
      cy.get("[data-cy=header-signup-btn]").should("exist").click();
      cy.url().should("include", "/signup");
    });
  });

  // describe block for logged in users-------------===
  describe("for logged in users", () => {
    before(() => {
      cy.request("POST", "/api/testing/resetUsers");
      cy.request("POST", "/api/users", {
        username: "user",
        password: "pass",
      });
    });

    beforeEach(() => {
      cy.login({ username: "user", password: "pass" });
      cy.visit("/notexist");
      cy.bypassLoading();
    });

    describe("nav menu icon appears for viewport of 500 x 800", () => {
      beforeEach(() => {
        cy.viewport(500, 800);
      });

      it("has a home item", () => {
        cy.get("[data-cy=header-menu-btn-xs]").should("exist").click();
        cy.get("[data-cy=header-menu-home-xs]").should("exist").click();
        cy.url().should("include", "/");
      });

      it("has a sets item", () => {
        cy.get("[data-cy=header-menu-btn-xs]").should("exist").click();
        cy.get("[data-cy=header-menu-sets-xs]").should("exist").click();
        cy.url().should("include", "/sets");
      });
    });

    it("has a home button", () => {
      cy.get("[data-cy=header-home-btn]").should("exist").click();
      cy.url().should("include", "/");
    });

    it("has a sets button", () => {
      cy.get("[data-cy=header-sets-btn]").should("exist").click();
      cy.url().should("include", "/sets");
    });

    it("has a theme switch", () => {
      // test clicking theme switch changes header color
      // assume it starts on dark mode
      cy.get("header").should(
        "have.css",
        "background-color",
        "rgb(33, 36, 70)"
      );
      cy.get("[data-cy=header-theme-switch]").should("exist").click();
      cy.get("header").should(
        "have.css",
        "background-color",
        "rgb(80, 105, 138)"
      );
    });

    it("has a profile button", () => {
      cy.get("[data-cy=header-profile-btn]").should("exist").click();
      cy.url().should("include", "/profile");
    });

    it("has a log out button", () => {
      cy.get("[data-cy=header-logout-btn]").should("exist").click();
      cy.url().should("include", "/logout");
      cy.contains("You have logged out").should("exist");
      cy.get("[data-cy=header-logout-btn]").should("not.exist");
    });
  });
});
