# Contributing to the search menu UI

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to the search menu UI. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [Prerequisites](#prerequisites)
  * [First Steps](#first-steps)
  * [Tests](#tests)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
  * [Pull Requests](#pull-requests)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [JohT](mailto:johnnyt@gmx.at).

## What should I know before I get started?

### Prerequisites
- Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Install [merger.js](https://github.com/joao-neves95/merger-js/blob/master/README.md) using `npm install merger-js -g`
- Install [maven](https://maven.apache.org/index.html)

### First steps

- [Fork](https://docs.github.com/en/github/getting-started-with-github/quickstart/fork-a-repo) this repository 
- Setup and build the project locally as described in [README.md](README.md#build-all)
- A list of all commands can be found in [COMMANDS.md](COMMANDS.md)

### Tests
- All unit tests are integrated into the build
- For immediate feedback open [test/js/SpecRunner.html](test/js/SpecRunner.html) and [example/test/js/SpecRunner.html](example/test/js/SpecRunner.html) to run the JavaScript [Jasmine](https://jasmine.github.io) Unit-Tests in the browser.
- To assure high automation this project enforces 80% branch coverage within the build, so please provide tests for every change.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for the search menu UI. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). Fill out [the required template](https://github.com/JohT/search-menu-ui/.github/blob/master/.github/ISSUE_TEMPLATE/bug_report.md), the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

* **Perform a [search](https://github.com/JohT/search-menu-ui/issues)** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue and provide the following information by filling in [the template](https://github.com/JohT/search-menu-UI/.github/blob/master/.github/ISSUE_TEMPLATE/bug_report.md).

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. For example, start by explaining how you started the search, e.g. which text exactly you used. When listing steps, **don't just say what you did, but explain how you did it**. For example, if you moved the cursor, explain if you used the mouse, or the keyboard.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.

* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Provide more context by answering these questions:

* **Did the problem start happening recently** (e.g. after updating to a new version) or was this always a problem?
* If the problem started happening recently, **can you reproduce the problem in an older version?** What's the most recent version in which the problem doesn't happen?
* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.
* If the problem is related to working with files (e.g. opening and editing files), **does the problem happen for all files and projects or only some?** Does the problem happen only when working with local or remote files (e.g. on network drives), with files of a specific type (e.g. only JavaScript or Python files), with large files or files with very long lines, or with files in a specific encoding? Is there anything else special about the files you are using?

Include details about your configuration and environment:

* **Which version of the search menu UI are you using?** 
* **What's the name and version of the OS and browser you're using**

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for the search menu UI, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). Fill in [the template](https://github.com/JohT/search-menu-ui/.github/blob/master/.github/ISSUE_TEMPLATE/feature_request.md), including the steps that you imagine you would take if the feature you're requesting existed.

#### Before Submitting An Enhancement Suggestion

* **Perform a [search](https://github.com/JohT/search-menu-ui/issues)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of the search menu UI which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **Explain why this enhancement would be useful** to most search menu UI users.
* **List some other text editors or applications where this enhancement exists.**
* **Specify which version you're using.**
* **Specify the name and version of the OS and browser you're using.**

### Your First Code Contribution

Unsure where to begin contributing to the search menu UI? You can start by looking through [good first issue][good first issue] labeled issues.

[good first issue]:https://github.com/JohT/search-menu-ui/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22

### Pull Requests

The process described here has several goals:

- Maintain and improve quality
- Engage the community in working toward the best possible search experience
- Enable a sustainable system for maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Start the description with the issue number the pull request relates to, e.g. "#3 Provide an example servlet"
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

The easiest approach is to write code that matches the style of existing one. If there is a very good reason, anyone is encouraged to improve existing style further. This will then be discussed in the pull request or for design inside the issue.

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Include a reference to the pull request
* Reference related issues and pull requests as well as further details liberally after the first line

### JavaScript

* Compatibility with old browser like IE5 is important for now. Please test your
changes with internet explorer developer mode in IE5 mode. Include polyfills or ponyfills 
if necessary. These are included in modules packages especially for ie. 
Including as many browsers as possible is a key feature, that might change someday, 
but only for a good reason.