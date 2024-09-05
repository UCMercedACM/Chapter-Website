---
sidebar_position: 5
slug: /website/contributing
---

# Contributing

Thank you for your interest in contributing to this project!

The following is a set of guidelines for contributing to this project.
These are just guidelines, not rules.

## Ways You Can Contribute

The ways you can contribute are not only limited to code changes, but so much more.
Some of the ways you can contribute are:

- Reporting a bug
- Discussing the current state and future of the project
- Submitting a fix
- Proposing new features
- Improving or editing documentation

Note that if you plan on proposing new features, please first discuss them with the webmaster and the team on the issues page.

## Writing Good Bug Reports

Please be aware of the following when you submit a bug report:

1. Ask on the server first (this is preferred). If you are unsure about an issue, please contact the webmaster for clarification.
2. Don't open duplicate issues. Please search your issue to see if it has been asked already. Duplicate issues will be closed.
3. When filing a bug about exceptions or stacktrace, please include the complete stacktrace. Without the complete stacktrace the issue might be unsolvable and you will be asked to provide more information.

If a bug report is not clear enough, or missing these information, then more than likely
it'll take longer to fix the bug, or it'll be closed. More than likely clarification will
be asked in order to aid in this process.

## Submitting Code

Submitting code is done through pull requests. Please ensure that the pull request
focuses on a single aspect and doesn't leave the scope of that aspect. You'll have to
keep in mind about the following guidelines when submitting code.

### Programming Style

In order to keep everything in check, [BiomeJS](https://biomejs.dev) is used. This is an all-in-one tool
designed to replace ESLint and Prettier. Biome is ran on every single pre-commit hook, plus it also
lints and formats the code as well. The best way to run Biome manually is to run the following command:

```bash
npx @biomejs/biome lint --write /react/src
```

### Static Code Analyzers

In addition to the tools mentioned, [SonarCloud](<https://sonarcloud.io/>) is also used to analyze the codebase.
If there is a issue raised by SonarCloud, please fix it. If you are unsure about the issue,
please contact the webmaster (Noelle) for clarification.

## Pull Request Details

### Source Control Branching Model

![Trunk Workflow](./trunk-workflow.svg)

The model used for source control branching is [trunk-based](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development).
The `react-rewrite` branch is known to contain in-progress code, thus it cannot be touched directly unless approved.

### Branch Naming Convention

When you create a branch, please use the following naming convention:

```bash
<name>/<type>
```

`<name>` is your name (you can use your GitHub name) and `<type>` is a concise one to three word description of the branch.
For example, if a pull request has the name `noelle/docs`, this indicates that the branch is created and owned by Noelle,
and the purpose of the branch is to update documentation. Slight variations of these are fine.

## Git Commit Guidelines

1. Use present tense and imperative mood when writing commit messages. For example, `Add new feature` instead of `Added new feature`.
2. Reference issues or pull requests outside of the first line.
    a. Please use the shorthand `#123` and not the full URL.
