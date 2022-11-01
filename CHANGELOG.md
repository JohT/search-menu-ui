# CHANGELOG.md

## **v0.8.1** Automate MergerJS (latest)

The command `npm run merger` is now able to run automatically.

[MergerJS](https://www.npmjs.com/package/merger-js) can be installed locally as development dependency and then be started using `npx merger build` as if it would've been installed globally. To simulate an arrow key up (also possible with the letter k) followed by an enter key these characters (selects "all"), the shell command can then be extended to `echo -ne \"k\n\" | npx merger build`. This closes the gap and enables a fully automated build for continuous integration.

## **v0.8.0** First Version

This is the first published version of the search menu UI including an example to try it out locally
and a servlet to include it into a java application.
Documentation is located in Markdown Files (`.md`) and inside the `docs` folder.
