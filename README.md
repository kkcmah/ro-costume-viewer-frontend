# RO Costume Viewer Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Additionally, it was made using [React](https://reactjs.org/), [MUI](https://mui.com/), [TypeScript](https://www.typescriptlang.org/), [Formik](https://formik.org/), [React Router](https://reactrouter.com/), and [Axios](https://axios-http.com/). Also, tested using [Cypress](https://www.cypress.io/).

The hosted version is here:

TODO

https://herokuapp.com

Initial load times can be slow if the Heroku server needs to come out of slumber.

The backend for this project can be found here:

https://github.com

## Project Motivation

Cosmetics are an ideal form of expressing oneself, especially in MMORPGs. In the game Ragnarok Online, thousands of costumes are available for customizing your characters.

I wanted to create a way for people to preview different costumes and manage their costume sets. Instead of farming for a certain costume, fumbling with Gacha RNG, sifting through your storage, and even having to load up the game, one can view their current and soon to be costumes on the web.

## Features

TODO put demo video and put timestamps?

- User persistance via sign up and login
- Previews are currently all using the base male Assassin Cross job model with a neutral pallete
- Ability for users to view a list of costumes, preview those that have urls, and favorite them
- Ability for users to like, create, view, update, and delete costume sets
- Profile page to view own created sets, favorited costumes, and liked sets
- Light and dark modes
- Search and pagination on costume list and costume set lists

## Scripts

#### `npm install`

Install the project dependencies.

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run lint`

Runs linter and lets you know if there are any issues among .ts and .tsx files.

### `npm run cypress:open`

First, ensure that the backend is running in test mode i.e. `npm run start:test`

Note: elements with data-cy props or similar data-\* props are used for testing and should be carried forward with any element changes or have their tests rewritten.

Opens Cypress for testing. Tests are located in cypress/integration/mine.

### `npm test`

This currently doesn't do anything. Jest and/or Cypress (from above) are the planned tools for this. Use `npm run cypress:open` for now.

### `npm build`

Builds the app for production to the `build` folder. Delete the source mapping .map files. Throw the build folder into the backend project's root directory and it will be served statically via Express.

## Roadmap

Ideally, I want to create a model viewer that allows users to select different genders, jobs, customize hair styles and color, customize clothing color, customize backgrounds, move, rotate, and superposition costumes on top of each other.

This project is mainly used as a learning tool for myself to improve my React and web skills. The aforementioned features would be built using this as a foundation of some sorts.

However, moving forwards with this project:

-Having worked with a non-relational database, MongoDB, on this project, I realize I prefer relational SQL databases. I may migrate over to MS SQL Server or PostgresSQL.

-I have some backend endpoints that allow admin type users to add costumes and costume tags. I may want to implement an admin portal.

-Currently, I am being hosted on free tiers. If there's a need, I may migrate to dedicated hosters.

## License

[MIT](https://choosealicense.com/licenses/mit/)

Ragnarok Online is owned by Gravity Interactive, Inc. This project is not endorsed by them.
