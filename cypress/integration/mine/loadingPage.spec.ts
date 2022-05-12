/// <reference types="cypress" />

describe("The Loading Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays buttons and icon container", () => {
    cy.get("[data-cy=stop-btn]").should("exist");
    cy.get("[data-cy=lets-go-btn]").should("exist");
    cy.get("[data-cy=new-icons-btn]").should("exist");
    cy.get("[data-cy=lp-icons-container]").should("exist");
  });

  it("clicking stop button stops automatic redirection", () => {
    cy.get("[data-cy=stop-btn]").click();
    cy.contains("Redirection stopped.").should("exist");
  });

  it("waiting 5 seconds automatically redirects and removes loading page from dom", () => {
    cy.wait(5000);
    cy.get("[data-cy=stop-btn]").should("not.exist");
    cy.get("[data-cy=lets-go-btn]").should("not.exist");
    cy.get("[data-cy=new-icons-btn]").should("not.exist");
    cy.get("[data-cy=lp-icons-container]").should("not.exist");
  });

  it("clicking lets go button redirects and removes loading page from dom", () => {
    cy.get("[data-cy=lets-go-btn]").click();
    cy.get("[data-cy=stop-btn]").should("not.exist");
    cy.get("[data-cy=lets-go-btn]").should("not.exist");
    cy.get("[data-cy=new-icons-btn]").should("not.exist");
    cy.get("[data-cy=lp-icons-container]").should("not.exist");
  });
});
