# Contributing

Glad you want to work on this project! This guide will go over how do you get started and many others!

If you have any questions, send an message on the `acm-website` channel on Discord.

## New to coding?

This repo uses [TypeScript](https://www.typescriptlang.org/), which is just an subset of JavaScript but with types. In production software, using TypeScript often will reduce the amount of errors and bugs due to the static typing system. 

But the first thing is to learn JavaScript. We will be using TailwindCSS, so it is important you also learn that as well. 

Here are some resources:

- [The Odin Project](https://www.theodinproject.com/)
- [Mozilla's JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- The workshops (attend them!)

## Getting Started

> [!IMPORTANT]
> There will be frequent dependency updates so make sure to pull the latest changes (`git pull`) frequently

### Setup

Make sure you have these installed:

- [Node.js 20.x](https://nodejs.org/en/download/)
- [Yarn 3](https://yarnpkg.com/getting-started/install) (Enable through `corepack`)
- [Git](https://git-scm.com/)

> Hint: You can use Node version managers such as [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to manage your
> Node versions.

1. Fork this repo (if you are not planning to committing to the repo, then just either clone or skip this step)

  ```bash
  git clone https://github.com/your-account/Chapter-Website && cd Chapter-Website
  ```

  - How do you fork?
    - Click on “Fork” on the top right
    - Then clone that fork you just made
    - `cd` (change directory) into the new cloned repo (`cd Chapter-Website`)

2. Ensure that you are in the branch `react-rewrite`

  - Need to switch branches? Run `git checkout react-rewrite`

3. CD into `./react/ucmacm-website`

4. Install the dependencies

  ```bash
  yarn install
  ```
5. Run the dev server. Ensure that you are in the correct directory (forked-repo/react/ucmacm-website)

  ```bash
  yarn dev
  ```

### Firebase

The website uses Firebase as the backend. You will need a Firebase key in order to authenticate with the database. 

- (Recommended) You can make your own [Firebase](https://firebase.google.com/) instance and use your own key

## Code and GitHub Guidelines

- If you are updating documentation, please prefix your commit message with `[skip ci]`. This will prevent the workflows from constantly kicking in
- For your pull request, it is required to have two or more people approve your PR. More than likely Noelle will read through most of them and give feedback.
- If you've fixed a particular issue then your last commit’s comment to this forked repository should include "closes" and the issue number e.g: “Fix an issue with data fetching (closes #123)”
- Make a pull request to the main repository (https://github.com/UCMercedACM/Chapter-Website/pulls)
