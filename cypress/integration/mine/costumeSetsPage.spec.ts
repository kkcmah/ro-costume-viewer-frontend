/// <reference types="cypress" />

describe("The Costume Sets page with 12 costumes", () => {
  before(() => {
    cy.request("POST", "/api/testing/resetCostumeSets");
    cy.request("POST", "/api/testing/resetUsers");
    cy.request("POST", "/api/users", {
      username: "user",
      password: "pass",
    });
    cy.login({ username: "user", password: "pass" }).then((res) => {
      const token = res;
      cy.seedNumCostumes(1).then((res) => {
        const seededCostumeId = res[0].id;
        // seed 12 costume sets starting from 10 so sorting works as intended
        for (let i = 10; i < 22; i++) {
          cy.seedCostumeSet(token, {
            name: `cosSet${i}`,
            description: `desc${i}`,
            isPublic: true,
            costumes: [seededCostumeId],
          });
        }
      });
    });
    cy.clearLocalStorage();
  });

  after(() => {
    cy.request("POST", "/api/testing/resetCostumeSets");
  });

  describe("as a non-logged in user", () => {
    beforeEach(() => {
      cy.visit("/sets");
      cy.bypassLoading();
    });

    it("doesn't show create button, but shows everything else correctly", () => {
      cy.contains("Showing 12 set");
      cy.get("[data-cy=sets-create-btn]").should("not.exist");
      cy.get("[data-cy=cs-search-name]").should("exist");
    });

    it("initially shows first 10 costume sets and clicking load more shows the rest and hides the button", () => {
      for (let i = 10; i < 20; i++) {
        cy.contains(`cosSet${i}`).should("exist");
      }
      cy.contains("cosSet20").should("not.exist");
      cy.get("[data-cy=CS-load-more-btn]")
        .should("exist")
        .click()
        .should("not.exist");
      for (let i = 10; i < 22; i++) {
        cy.contains(`cosSet${i}`).should("exist");
      }
    });

    it("searching for set name that doesn't exist shows appropriate message", () => {
      cy.get("[data-cy=cs-search-name]").type("notexist{enter}");
      cy.contains("Showing 0 set").should("exist");
      cy.get("[data-cy=CS-load-more-btn]").should("not.exist");
    });

    it("searching for set name that exists shows it", () => {
      cy.get("[data-cy=cs-search-name]").type("set15{enter}");
      cy.contains("Showing 1 set").should("exist");
      cy.get("[data-cy=CS-load-more-btn]").should("not.exist");
      cy.contains("cosSet15").should("exist");
    });
  });

  describe("as a logged in user", () => {
    beforeEach(() => {
      cy.login({ username: "user", password: "pass" });
      cy.visit("/sets");
      cy.bypassLoading();
    });

    it("everything is displayed correctly and create btn redirects to create set", () => {
      cy.contains("Showing 12 set");
      cy.get("[data-cy=cs-search-name]").should("exist");
      for (let i = 10; i < 20; i++) {
        cy.contains(`cosSet${i}`).should("exist");
      }
      cy.contains("cosSet20").should("not.exist");
      cy.get("[data-cy=sets-create-btn]").should("exist").click();
      cy.url().should("include", "/sets/create");
      cy.get("h5").first().should("have.text", "Create Set");
    });
  });
});
