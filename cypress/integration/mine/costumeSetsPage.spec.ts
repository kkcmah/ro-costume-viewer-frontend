/// <reference types="cypress" />

describe("The Costume Sets page", () => {
  it("as a non-logged in user doesn't show create button, but shows search", () => {
    cy.visit("/sets");
    cy.bypassLoading();
    cy.get("[data-cy=sets-create-btn]").should("not.exist");
    cy.get("[data-cy=cs-search-name]").should("exist");
  });

  describe("as a logged in user", () => {
    before(() => {
      cy.request("POST", "/api/testing/resetCostumeSets");
      cy.request("POST", "/api/testing/resetUsers");
      cy.request("POST", "/api/users", {
        username: "user",
        password: "pass",
      });
    });

    beforeEach(() => {
      cy.login({ username: "user", password: "pass" });
      cy.visit("/sets");
      cy.bypassLoading();
    });

    it("has a create button, search input, and displays no sets message", () => {
      cy.contains("Showing 0 set");
      cy.get("[data-cy=cs-search-name]").should("exist");
      cy.get("[data-cy=sets-create-btn]").should("exist").click();
      cy.url().should("include", "/sets/create");
      cy.get("h5").first().should("have.text", "Create Set");
    });
  });
});
