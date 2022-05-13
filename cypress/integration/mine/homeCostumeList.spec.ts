/// <reference types="cypress" />

import { EquipSlot } from "../../../src/types";

describe("The Home Costume List Page", () => {
  describe(" with 3 costumes", () => {
    const cos123Top = {
      itemId: 123,
      name: "searchme123",
      equipSlots: [EquipSlot.Top],
      costumeTags: [],
      previewUrl: "",
      className: "costume costume-18740",
    };
    const cos246MidPrev = {
      itemId: 246,
      name: "middlecostume",
      equipSlots: [EquipSlot.Middle],
      costumeTags: [],
      previewUrl: "ihavepreviewurl",
      className: "costume costume-18740",
    };
    const cos367LowEff = {
      itemId: 367,
      name: "lowerandeffectCostume",
      equipSlots: [EquipSlot.Lower, EquipSlot.Effect],
      costumeTags: [],
      previewUrl: "",
      className: "costume costume-18740",
    };
    before(() => {
      cy.request("POST", "/api/testing/resetCostumes");
      cy.seedCostume(cos123Top);
      cy.seedCostume(cos246MidPrev);
      cy.seedCostume(cos367LowEff);
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
      // non signed in user cannot see favorite button
      cy.get("[data-cy=costumes-table-fav-btn]").should("not.exist");
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
      cy.contains("No costumes found").should("exist");
      cy.get("table").should("not.exist");
    });

    it("searching for item id that exists works", () => {
      cy.get("[data-cy=CL-itemid-input]").type(`${cos123Top.itemId}`);
      cy.get("[data-cy=CL-search-btn]").click();
      // one tr is header row and other is the item
      cy.get("tr").should("have.length", 2);
      cy.contains(cos123Top.name).should("exist");
    });

    it("searching for name that doesn't exist displays appropriate message and hides table", () => {
      cy.get("[data-cy=CL-name-input]").type("idontexist");
      cy.get("[data-cy=CL-search-btn]").click();
      cy.contains("No costumes found").should("exist");
      cy.get("table").should("not.exist");
    });

    it("searching for name that exists works", () => {
      cy.get("[data-cy=CL-name-input]").type("chme");
      cy.get("[data-cy=CL-search-btn]").click();
      // one tr is header row and other is the item
      cy.get("tr").should("have.length", 2);
      cy.contains(cos123Top.name).should("exist");
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
      cy.contains(cos246MidPrev.name).should("exist");
      cy.contains(cos367LowEff.name).should("not.exist");
    });

    it("selecting 2 slots that exists works", () => {
      cy.get("#search-equipSlots-input").click();
      cy.get("[data-value=Lower").click();
      cy.get("[data-value=Effect").click();
      cy.get("[data-cy=CL-search-btn]").click({ force: true });
      cy.get("tr").should("have.length", 2);
      cy.contains(cos367LowEff.name).should("exist");
      cy.contains(cos246MidPrev.name).should("not.exist");
    });

    it("searching then resetting displays original list", () => {
      cy.get("[data-cy=CL-name-input]").type("idontexist");
      cy.get("[data-cy=CL-search-btn]").click();
      cy.contains("No costumes found").should("exist");
      cy.get("[data-cy=CL-reset-btn]").click();
      cy.get("tr").should("have.length", 4);
      cy.contains(cos123Top.name).should("exist");
      cy.contains(cos246MidPrev.name).should("exist");
      cy.contains(cos367LowEff.name).should("exist");
    });

    it("searching using all inputs works", () => {
      cy.get("[data-cy=CL-itemid-input]").type(`${cos123Top.itemId}`);
      cy.get("[data-cy=CL-name-input]").type(`${cos123Top.name}`);
      cy.get("#search-equipSlots-input").click();
      cy.get("[data-value=Top").click();
      cy.get("[data-cy=CL-search-btn]").click({ force: true });
      cy.get("tr").should("have.length", 2);
      cy.contains(cos123Top.name).should("exist");
      cy.contains(cos246MidPrev.name).should("not.exist");
    });

    it("costume with previewurl has clickable button for previewing", () => {
      cy.get("[data-cy=costumes-table-preview-sm-btn]")
        .as("smBtn")
        .should("exist");
      cy.get("[data-cy=costumes-table-preview-icon-btn]")
        .as("iconBtn")
        .parent()
        .should("have.css", "display", "none");
      // check that preview button becomes icon btn when screen is smaller
      cy.viewport(320, 480);
      cy.get("@smBtn").parent().should("have.css", "display", "none");
      cy.get("@iconBtn").should("exist").click();
      // clicking preview button opens preview dialog
      cy.contains(`Previewing ${cos246MidPrev.name}`).should("exist");
    });

    describe("a signed in user", () => {
      before(() => {
        cy.request("POST", "/api/testing/resetUsers");
        cy.request("POST", "/api/users", {
          username: "user",
          password: "pass",
        });
      });

      beforeEach(() => {
        cy.login({ username: "user", password: "pass" });
        cy.visit("/");
        cy.bypassLoading();
      });

      it("can favorite a costume and unfavorite it", () => {
        cy.get(`[data-cy=costumes-table-fav-btn-${cos123Top.itemId}]`)
          .as("favBtn")
          .should("exist")
          .click();
        cy.get("@favBtn")
          .find("svg")
          .should("have.css", "color", "rgb(255, 0, 0)");
        cy.get("@favBtn").click();
        cy.get("@favBtn")
          .find("svg")
          .should("have.css", "color", "rgb(255, 255, 255)");
      });

      it("can favorite a costume and it will show in profile favorites", () => {
        cy.get(`[data-cy=costumes-table-fav-btn-${cos123Top.itemId}]`)
          .as("favBtn")
          .should("exist")
          .click();
        cy.get("@favBtn")
          .find("svg")
          .should("have.css", "color", "rgb(255, 0, 0)");
        cy.get("[data-cy=header-profile-btn]").click();
        cy.get("[data-cy=profile-tab-fav-costumes]").click();
        cy.contains(cos123Top.name).should("exist");
        cy.get("@favBtn")
          .find("svg")
          .should("have.css", "color", "rgb(255, 0, 0)");
      });
    });
  });

  describe("with 22 costumes", () => {
    // test pagination functions
    const totalNumCos = 22;
    before(() => {
      cy.request("POST", "/api/testing/resetCostumes");
      cy.seedNumCostumes(totalNumCos);
    });

    beforeEach(() => {
      cy.visit("/");
      cy.bypassLoading();
    });

    it("pagination shows correct initial values", () => {
      cy.get("tr").should("have.length", 11);
      for (let i = 10; i < 20; i++) {
        cy.contains(`cosname${i}`).should("exist");
      }
      cy.contains("cosname20").should("not.exist");
      cy.get(".MuiTablePagination-select").contains("10").should("exist");
      cy.get(".MuiTablePagination-displayedRows").should(
        "have.text",
        `1–10 of ${totalNumCos}`
      );
      cy.get('[title="Go to previous page"]').should("be.disabled");
      cy.get('[title="Go to next page"]').should("not.be.disabled");
    });

    it("clicking next page shows next set of costumes and pagination values are updated", () => {
      cy.get('[title="Go to next page"]').click();
      cy.get("tr").should("have.length", 11);
      for (let i = 20; i < 30; i++) {
        cy.contains(`cosname${i}`).should("exist");
      }
      cy.contains("cosname30").should("not.exist");
      cy.get(".MuiTablePagination-select").contains("10").should("exist");
      cy.get(".MuiTablePagination-displayedRows").should(
        "have.text",
        `11–20 of ${totalNumCos}`
      );
      cy.get('[title="Go to previous page"]').should("not.be.disabled");
      cy.get('[title="Go to next page"]').should("not.be.disabled");
    });

    it("clicking next page then prev page shows initial state", () => {
      cy.get('[title="Go to next page"]').click();
      cy.get('[title="Go to previous page"]').click();
      // copied from initial values test above ====
      cy.get("tr").should("have.length", 11);
      for (let i = 10; i < 20; i++) {
        cy.contains(`cosname${i}`).should("exist");
      }
      cy.contains("cosname20").should("not.exist");
      cy.get(".MuiTablePagination-select").contains("10").should("exist");
      cy.get(".MuiTablePagination-displayedRows").should(
        "have.text",
        `1–10 of ${totalNumCos}`
      );
      cy.get('[title="Go to previous page"]').should("be.disabled");
      cy.get('[title="Go to next page"]').should("not.be.disabled");
    });

    it("clicking next page until last page displays correct state", () => {
      cy.get('[title="Go to next page"]').click();
      cy.get('[title="Go to next page"]').click();
      cy.get("tr").should("have.length", 3);
      for (let i = 30; i < 10 + totalNumCos; i++) {
        cy.contains(`cosname${i}`).should("exist");
      }
      cy.contains("cosname29").should("not.exist");
      cy.get(".MuiTablePagination-select").contains("10").should("exist");
      cy.get(".MuiTablePagination-displayedRows").should(
        "have.text",
        `21–${totalNumCos} of ${totalNumCos}`
      );
      cy.get('[title="Go to previous page"]').should("not.be.disabled");
      cy.get('[title="Go to next page"]').should("be.disabled");
    });

    it("clicking next page then changing num of rows goes back to page 0 and displays correct state", () => {
      cy.get('[title="Go to next page"]').click();
      cy.get(".MuiTablePagination-select").click();
      cy.get("[data-value=100]").click();
      cy.get("tr").should("have.length", totalNumCos + 1);
      for (let i = 10; i < 10 + totalNumCos; i++) {
        cy.contains(`cosname${i}`).should("exist");
      }
      cy.get(".MuiTablePagination-select").contains("100").should("exist");
      cy.get(".MuiTablePagination-displayedRows").should(
        "have.text",
        `1–${totalNumCos} of ${totalNumCos}`
      );
      cy.get('[title="Go to previous page"]').should("be.disabled");
      cy.get('[title="Go to next page"]').should("be.disabled");
    });

    describe("a signed in user", () => {
      before(() => {
        cy.request("POST", "/api/testing/resetUsers");
        cy.request("POST", "/api/users", {
          username: "user",
          password: "pass",
        });
      });

      beforeEach(() => {
        cy.login({ username: "user", password: "pass" });
        cy.visit("/");
        cy.bypassLoading();
      });

      it("can favorite a costume go to next page then prev page and see that costume still favorited", () => {
        cy.get(`[data-cy=costumes-table-fav-btn-2]`)
          .as("favBtn")
          .should("exist")
          .click();
        cy.get("@favBtn")
          .find("svg")
          .should("have.css", "color", "rgb(255, 0, 0)");
        cy.get('[title="Go to next page"]').click();
        cy.get('[title="Go to previous page"]').click();
        cy.get("@favBtn")
          .find("svg")
          .should("have.css", "color", "rgb(255, 0, 0)");
      });
    });
  });
});
