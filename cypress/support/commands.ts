// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --

import { getRandomEquipSlot } from ".";

// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("bypassLoading", () => {
  cy.get("[data-cy=lets-go-btn]").click();
});

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "/api/login", {
    username,
    password,
  }).then((response) => {
    localStorage.setItem("user", response.body.token as string);
  });
});

Cypress.Commands.add(
  "seedCostume",
  ({ itemId, name, equipSlots, costumeTags, previewUrl, className }) => {
    cy.request({
      url: "/api/testing/seed/costume",
      method: "POST",
      body: { itemId, name, equipSlots, costumeTags, previewUrl, className },
    });
  }
);

Cypress.Commands.add("seedNumCostumes", (num) => {
  // start from 10 so that sorting works as intended else you get ex. 8 coming after 10
  const numStart = 10;
  const costumesToSeed = [];
  for (let i = 0; i < num; i++) {
    costumesToSeed.push({
      itemId: i,
      name: `cosname${numStart + i}`,
      equipSlots: [getRandomEquipSlot()],
      costumeTags: [],
      previewUrl: Math.random() > 0.5 ? "test" : "",
      className: `costume costume-${18740 + i}`,
    });
  }
  cy.request("POST", "/api/testing/seed/manyCostumes", costumesToSeed);
});
