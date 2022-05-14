/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import {
  Costume,
  CostumeSet,
  EquipSlot,
  NewCostume,
  NewCostumeSet,
  UserLoginCreds,
} from "../../src/types";

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login({username: "myuser", password: "mypass"})
       */
      login(userLoginCreds: UserLoginCreds): Chainable<string>;
      /**
       * Custom command to bypass the page refresh loading screen
       * @example cy.bypassLoading()
       */
      bypassLoading(): Chainable<Element>;
      /**
       * Custom command to seed a costume
       * @example cy.seedCostume({itemId: 123,
       * name: "hat",
       * equipSlots: [EquipSlot.Top],
       * costumeTags: [] or (note tag has to be seeded first) ["Blue"],
       * previewUrl: "https://urlhere",
       * className: "costume costume-18740"})
       */
      seedCostume(newCostume: NewCostume): Chainable<Costume>;
      /**
       * Custom command to seed a specified number of random costumes.
       * itemIds start at 0.
       * name starts at cosname10 and goes up to cosname10+num ex. cosname10, cosname11, .... cosname29
       * @example cy.seedNumCostumes(30)
       */
      seedNumCostumes(num: number): Chainable<Costume[]>;
      /**
       * Custom command to seed a costume set.
       * First seed a user, get token
       * then seed some costumes then use costumes ids and token here.
       * @example cy.seedCostume("usertoken" {
       * name: "cossetname",
       * description: "cossetdescription",
       * isPublic: false,
       * costumes: (mongodb costume ids) [absib3b2b3]
       */
      seedCostumeSet(
        token: string,
        newCostumeSet: NewCostumeSet
      ): Chainable<CostumeSet>;
    }
  }
}

// helper for seeding costume to get a random equip slot
export const getRandomEquipSlot = (): EquipSlot => {
  const ind = Math.floor(Math.random() * Object.keys(EquipSlot).length);
  // cy.log(`${Object.keys(EquipSlot)[ind]}`);
  return EquipSlot[`${Object.keys(EquipSlot)[ind]}`] as EquipSlot;
};
