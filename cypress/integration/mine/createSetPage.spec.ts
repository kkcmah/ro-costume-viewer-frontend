/// <reference types="cypress" />

describe("The Create Set page with 10 costumes", () => {
  before(() => {
    cy.request("POST", "/api/testing/resetCostumes");
    cy.seedNumCostumes(10);
  });

  after(() => {
    cy.request("POST", "/api/testing/resetCostumeSets");
  });

  it("as a non-logged in user displays appropriate message", () => {
    cy.visit("/sets/create");
    cy.bypassLoading();
    cy.get("#create-name-input").should("not.exist");
    cy.contains("You must be logged in to create a set.").should("exist");
  });

  describe("as a logged in user", () => {
    before(() => {
      cy.request("POST", "/api/testing/resetUsers");
      cy.request("POST", "/api/users", {
        username: "user",
        password: "pass",
      });
    });

    beforeEach(() => {
      cy.login({ username: "user", password: "pass" });
      cy.visit("/sets/create");
      cy.bypassLoading();
    });

    it("displays the create form and costumes form and table", () => {
      cy.get("h5").first().should("have.text", "Create Set");
      cy.get("#create-name-input").should("exist");
      cy.get("#create-description-input").should("exist");
      cy.get("#create-public-switch").should("exist").should("not.be.checked");
      cy.get("#create-set-btn")
        .should("exist")
        .should("have.text", "Create")
        .should("be.disabled");
      cy.get("#costume-set-list-header")
        .should("exist")
        .contains("There will be 0 costume");
      // check costumes list form and table exists
      cy.get("h5").last().should("have.text", "Costumes");
      cy.get("[data-cy=CL-itemid-input]").should("exist");
      cy.get("[data-cy=CL-name-input]").should("exist");
      cy.get("#search-equipSlots-input").should("exist");
      cy.get("[data-cy=CL-search-btn]").should("exist");
      cy.get("[data-cy=CL-reset-btn]").should("exist");
      cy.get("table").should("exist");
    });

    it("name input shows required error if left blank", () => {
      cy.get("#create-name-input").focus().blur();
      cy.contains("Required").should("exist");
      cy.get("#create-set-btn").should("exist").should("be.disabled");
    });

    it("name input shows error if input is too long", () => {
      cy.get("#create-name-input")
        .type(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id fringilla odio. Etiam ut rhoncus aca."
        )
        .blur();
      cy.contains("Name must be less than 100 characters").should("exist");
      cy.get("#create-set-btn").should("exist").should("be.disabled");
    });

    it("description input shows error if input is too long", () => {
      cy.get("#create-description-input")
        .type(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin lorem in lorem maximus maximus. Nullam metus nulla, facilisis eu ligula ac, bibendum consectetur enim. Integer dapibus dui purus, vitae congue nibh mattis eget. Donec malesuada euismod leo, ac semper libero cursus posuerea."
        )
        .blur();
      cy.contains("Description must be less than 300 characters").should(
        "exist"
      );
      cy.get("#create-set-btn").should("exist").should("be.disabled");
    });

    it("public switch can be toggled", () => {
      cy.get("#create-public-switch")
        .should("not.be.checked")
        .click()
        .should("be.checked");
    });

    it("valid form and no costumes selected shows message to select costumes", () => {
      cy.get("#create-name-input").type("valid");
      cy.contains(
        "Select at least one costume from below to include in set"
      ).should("exist");
      cy.get("#create-set-btn").should("exist").should("be.disabled");
    });

    it("selecting costume adds it to the accordian list", () => {
      cy.contains("cosname15")
        .parent()
        .find(".MuiCheckbox-root")
        .should("exist")
        .should("not.have.class", "Mui-checked")
        .click()
        .should("have.class", "Mui-checked")
        .as("checkbox");
      cy.get("#costume-set-list-header").click();
      cy.get("#costume-set-list-content > div > ul > li")
        .should("have.length", 1)
        .contains("cosname15")
        .should("exist");
      // also removing it from accordian list removes checked from table
      cy.get("[data-testid=DeleteIcon]").click();
      cy.get("@checkbox").should("not.have.class", "Mui-checked");
    });

    describe("creating valid costume set", () => {
      beforeEach(() => {
        cy.request("POST", "/api/testing/resetCostumeSets");
      });

      it("non-public costume set can be created and it shows up in profile", () => {
        cy.get("#create-name-input").type("new nonpublic costume set");
        cy.get("#create-description-input").type("new description");
        cy.contains("cosname15").parent().find(".MuiCheckbox-root").click();
        cy.contains(
          "Select at least one costume from below to include in set"
        ).should("not.exist");
        cy.contains("There will be 1 costume").should("exist");
        cy.get("#create-set-btn").click();
        cy.contains("Costume set created!").should("exist");
        cy.get("[data-cy=CSF-profile-link]").should("exist").click();
        cy.url().should("include", "/profile");
        cy.contains("new nonpublic costume set").should("exist");
        cy.contains("new description").should("exist");
        // check going to sets page doesnt show this set since it is non public
        cy.get("[data-cy=header-sets-btn]").click();
        cy.contains("new nonpublic costume set").should("not.exist");
      });

      it("public costume set with 2 costumes can be created and it shows up in sets and profile", () => {
        cy.get("#create-name-input").type("new public costume set");
        cy.get("#create-description-input").type("new description");
        cy.get("#create-public-switch")
          .should("not.be.checked")
          .click()
          .should("be.checked");
        cy.contains("cosname15").parent().find(".MuiCheckbox-root").click();
        cy.contains("cosname17").parent().find(".MuiCheckbox-root").click();
        cy.contains(
          "Select at least one costume from below to include in set"
        ).should("not.exist");
        cy.contains("There will be 2 costume").should("exist");
        cy.get("#create-set-btn").click();
        cy.contains("Costume set created!").should("exist");
        cy.get("[data-cy=CSF-sets-link]").should("exist").click();
        cy.url().should("include", "/sets");
        cy.contains("new public costume set").should("exist");
        cy.contains("new description").should("exist");
        // check going to profile page shows this set
        cy.get("[data-cy=header-profile-btn]").click();
        cy.contains("new public costume set").should("exist");
      });
    });
  });
});
