# Commands

Overview of the commands to test, run and build this project as well as those that were used to setup it.

## Most important commands for development

- `npm install` Installs all dependencies and creates the folder `node_modules`, that is needed for all following commands.
- `npm run all` Ready to publish build with test, coverage, doc generation, dev+prod build incl. examples
- `npm run changelog` Update CHANGELOG.md

## Commands to test, run and build the project

- `npm run all` Runs all builds including those of the examples
- `npm run package` Runs all steps incl. test, coverage, doc generation and build
- `npm run coverage` Run all unit tests (using jasmine) **with** reporting coverage (using nyc/istanbul)
- `npm test` Only all unit tests (using jasmine) **without** coverage report
- `npm run coverage-badge` Updates code coverage badge inside `README.md`
- `npm run doc` Generates JSDoc Documentation in folder "docs"
- `npm run build` Builds the application for production including minification,...
- `npm run dev` Builds the application for development (without minification) and starts the live server
- `npm run devbuild` Builds the application for development (without minification) without starting the server.
- `npm run merger` Merges JavaScript source files javascript file bundles that can be used with/without module system and can therefore be used directly within the browser (without node.js e.g.).
The command itself needs to send the letter "k" and the enter key to the merger command to automate
the key prompt that would otherwise block continuous integration.

## Commands used to setup the project

- `npm init` Initialize node package manager, creates `package.json` file.
- `npm install jasmine --save-dev` Adds jasmine unit test framework as development dependency.
- `npx jasmine init` Initializes jasmine, creates `spec/support/jasmine.json` file.
- `npm install parcel-bundler --save-dev` Adds parcel-bundler as development dependency.
- `npm install nyc --save-dev` Setup code coverage reports (successor of"istanbul")
- `npm install jsdoc --save-dev` Setup JavaScript Documentation (JSDoc)
- `npm install eslint --save-dev` Setup linter (static code quality analyzer)
- `npx eslint --init` Initialize linter configuration file
- `npm install istanbul-badges-readme --save-dev` Setup for code coverage badge for README.MD.
- `npm install --save-exact --save-dev node-notifier inquirer merger-js` Setup file merger for vanilla JS distributions
- `npm audit fix` Fixes vulnerabilities

## Commands for maintainer

- `npm login` + `npm publish` To publish a new release. Be sure to run npm run package first.

## Further steps

- It would be great to get SpecRunner.html up and running in dev mode like: "dev": "parcel ./test/js/SpecRunner.html". [parcel issue 3407](https://github.com/parcel-bundler/parcel/issues/3407) may be key for that.

## References

- [Parcel - Getting Started](https://parceljs.org/getting_started.html)
- [Jasmine - Using Jasmine with node](https://jasmine.github.io/setup/nodejs.html)
- [Istanbul/nyc - Installation & Usage](https://github.com/istanbuljs/nyc#installation--usage)
- [ESLint - Getting Started](https://eslint.org/docs/user-guide/getting-started)
