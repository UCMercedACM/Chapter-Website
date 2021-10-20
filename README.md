# Association for Computing Machinery's UC Merced Chapter

[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)

## Want to Contribute?

**Clone** or **Fork** the repository locally and either run it through docker or just locally in your terminal. If you are going to make a change or alteration. Make a branch off of the *master* branch and make a Pull Request when you are done so the Leadership team can review it.

> Note: if you are forking the repository you do not need to make a branch off the **master** branch, because your forked **master** will already be a branch off our **master** branch

[Contribute Documents](https://github.com/UCMercedACM/Chapter-Website/blob/master/CONTRIBUTING.md)

### Figma Mockup

Created by Mary Delos Reyes [SIG Design Lead] - [mockup](https://www.figma.com/file/R63olIJGYgI6c0Exjelpze/Light-Mode-ACM)

## Installation and Setup Requirements

If the item below is checked it is required

- [x] [Node.js](https://nodejs.org/en/download/) .... p.s. **v12.19.0** is a safe option, but really recommended to install [**nvm**](https://github.com/nvm-sh/nvm)
- [x] [Yarn Classic](https://classic.yarnpkg.com/en/docs/install)
- [ ] [Angular CLI](https://angular.io/guide/setup-local)
- [ ] [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Development server

### Locally

Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Docker

> Note: usually only run this environment when testing a mock production on your local computer.

1. First you need to build the container -> `docker build -t acm-chapter-website .`
2. Then you can run the container -> `docker run -dp 4200:4200 acm-chapter-website`

## Building a new component

> Note: only build a new component if it is either a page or reusable component
> If you are making an new section or something just brand new that will only exist in one page build it into that page rather than making it a whole component.

Run `yarn ng generate component component-name` to generate a new component. After the component is generated drag it into the _components_ folder. While new pages are still components they get dragged to the _pages_ folder.

### If you are making a reusable component

Please make sure to create a storybook of that component so we can see the component in a standalone environment. To start the storybook environment just run `yarn storybook`. To create a new story for your component, create a `component-name.stories.ts` inside the _stories_ folder.

## Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deploying to GH Pages
simply run `ng deploy chapter-website --base-href=/Chapter-Website/`
## Testing

### Lint

Run `yarn lint` to execute the airbnb linter style guide.

### Running unit tests

Run `yarn test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `yarn e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
