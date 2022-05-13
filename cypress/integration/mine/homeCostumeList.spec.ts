/// <reference types="cypress" />

import { EquipSlot } from "../../../src/types";

describe("The Home Costume List Page with 3 costumes", () => {
  before(() => {
    cy.request("POST", "/api/testing/resetCostumes");
    // cy.seedNumCostumes(30);
    cy.seedCostume({
      itemId: 123,
      name: "searchme123",
      equipSlots: [EquipSlot.Top],
      costumeTags: [],
      previewUrl: "",
      className: "costume costume-18740",
    });
    cy.seedCostume({
      itemId: 246,
      name: "middlecostume",
      equipSlots: [EquipSlot.Middle],
      costumeTags: [],
      previewUrl: "",
      className: "costume costume-18740",
    });
    cy.seedCostume({
      itemId: 367,
      name: "lowerandeffectCostume",
      equipSlots: [EquipSlot.Lower, EquipSlot.Effect],
      costumeTags: [],
      previewUrl: "",
      className: "costume costume-18740",
    });
  });

  beforeEach(() => {
    cy.visit("/");
    cy.bypassLoading();
  });

  it("displays costumes search form and table", () => {
    cy.get("h5").should("have.text", "Costumes");
    cy.get("[data-cy=CL-itemid-input]").should("exist");
    cy.get("[data-cy=CL-name-input]").should("exist");
    // couldn't get data-cy working on select
    cy.get("#search-equipSlots-input").should("exist");
    cy.get("[data-cy=CL-search-btn]").should("exist");
    cy.get("[data-cy=CL-reset-btn]").should("exist");
    cy.get("table").should("exist");
  });

  it("inputting non numeric into item id input displays error validation message", () => {
    cy.get("[data-cy=CL-itemid-input] > div > input")
      .focus()
      .type("abc")
      .blur();
    cy.contains("Please input a number or leave empty");
    cy.get("[data-cy=CL-search-btn]").should("be.disabled");
  });

  it("searching for item id that doesn't exist displays appropriate message and hides table", () => {
    cy.get("[data-cy=CL-itemid-input]").type("2856");
    cy.get("[data-cy=CL-search-btn]").click();
    cy.contains("No costumes found");
    cy.get("table").should("not.exist");
  });

  it("searching for item id that exists works", () => {
    cy.get("[data-cy=CL-itemid-input]").type("123");
    cy.get("[data-cy=CL-search-btn]").click();
    // one tr is header row and other is the item
    cy.get("tr").should("have.length", 2);
    cy.contains("searchme123").should("exist");
  });

  it("searching for name that doesn't exist displays appropriate message and hides table", () => {
    cy.get("[data-cy=CL-name-input]").type("idontexist");
    cy.get("[data-cy=CL-search-btn]").click();
    cy.contains("No costumes found");
    cy.get("table").should("not.exist");
  });

  it("searching for name that exists works", () => {
    cy.get("[data-cy=CL-name-input]").type("chme");
    cy.get("[data-cy=CL-search-btn]").click();
    // one tr is header row and other is the item
    cy.get("tr").should("have.length", 2);
    cy.contains("searchme123").should("exist");
  });

  it("selecting slot that doesn't exist displays appropriate message and hides table", () => {
    cy.get("#search-equipSlots-input").click();
    cy.get("[data-value=Garment").click();
    cy.get("[data-cy=CL-search-btn]").click({ force: true });
    cy.contains("No costumes found");
    cy.get("table").should("not.exist");
  });

  it("selecting slot that exists works", () => {
    cy.get("#search-equipSlots-input").click();
    cy.get("[data-value=Middle").click();
    cy.get("[data-cy=CL-search-btn]").click({ force: true });
    cy.get("tr").should("have.length", 2);
    cy.contains("middlecostume").should("exist");
    cy.contains("lowerandeffectCostume").should("not.exist");
  });

  it("selecting 2 slots that exists works", () => {
    cy.get("#search-equipSlots-input").click();
    cy.get("[data-value=Lower").click();
    cy.get("[data-value=Effect").click();
    cy.get("[data-cy=CL-search-btn]").click({ force: true });
    cy.get("tr").should("have.length", 2);
    cy.contains("lowerandeffectCostume").should("exist");
    cy.contains("middlecostume").should("not.exist");
  });
});
