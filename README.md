# Association for Computing Machinery's UC Merced Chapter

[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)

## Want to Contribute?

Clone the repository locally and either run it through docker or just locally in your terminal. If you are going to make a change or alteration. Make a branch off of the *master* branch and make a Pull Request when you are done so the Leadership team can review it.

### Development server

Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Building a new component

> Note: only build a new component if it is either a page or reusable component
> If you are making an new section or something just brand new that will only exist in one page build it into that page rather than making it a whole component.

Run `yarn ng generate component component-name` to generate a new component. After the component is generated drag it into the _components_ folder. While new pages are still components they get dragged to the _pages_ folder.

> Note: You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### If you are making a reusable component

Please make sure to create a storybook of that component so we can see the component in a standalone environment. To start the storybook environment just run `yarn storybook`. To create a new story  for your component, create a `component-name.stories.ts` inside the _stories_ folder.

### Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Testing

#### Lint

Run `yarn lint` to execute the airbnb linter style guide.

#### Running unit tests

Run `yarn test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Running end-to-end tests

Run `yarn e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
