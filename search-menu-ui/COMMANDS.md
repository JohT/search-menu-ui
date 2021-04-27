# Commands

Overview of the commands to test, run and build this project as well as those that were used to setup it.

## Commands to test, run and build the project:
- `npm install` Installs all dependencies and creates the folder `node_modules`, that is needed for all following commands.
- `npm run package` Runs all steps incl. test, coverage, doc generation and build
- `npm run coverage` Run all unit tests (using jasmine) **with** reporting coverage (using nyc/istanbul)
- `npm test` Only all unit tests (using jasmine) **without** coverage report
- `npm run coverage-badge` Updates code coverage badge inside `README.md`
- `npm run doc` Generates JSDoc Documentation in folder "docs"
- `npm run build` Builds the application for production including minification,...
- `npm run dev` Builds the application for development (without minification) and starts the live server
- `npm run watch` Builds the application for development (without minification) without starting the server.

## Commands used to setup the project:
- `npm init` Initialize node package manager, creates `package.json` file.
- `npm install jasmine --save-dev` Adds jasmine unit test framework as development dependency.
- `npx jasmine init` Initializes jasmine, creates `spec/support/jasmine.json` file.
- `npm install parcel-bundler --save-dev` Adds parcel-bundler as development dependency.
- `npm install nyc --save-dev` Setup code coverage reports (successor of"istanbul")
- `npm install jsdoc --save-dev` Setup JavaScript Documentation (JSDoc)
- `npm install eslint --save-dev` Setup linter (static code quality analyzer)
- `npx eslint --init` Initialize linter configuration file
- `npm install istanbul-badges-readme --save-dev` Setup for code coverage badge for README.MD.
- `npm audit fix` Fixes vulnerabilities

## Further steps:
- It would be great to get SpecRunner.html up and running in dev mode like: "dev": "parcel ./test/js/SpecRunner.html". [parcel issue 3407](https://github.com/parcel-bundler/parcel/issues/3407) may be key for that.

## References
 * [Parcel - Getting Started](https://parceljs.org/getting_started.html)
 * [Jasmine - Using Jasmine with node](https://jasmine.github.io/setup/nodejs.html)
 * [Istanbul/nyc - Installation & Usage](https://github.com/istanbuljs/nyc#installation--usage)
 * [ESLint - Getting Started](https://eslint.org/docs/user-guide/getting-started)
