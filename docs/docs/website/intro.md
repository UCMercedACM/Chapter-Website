---
sidebar_position: 3
slug: /website/intro
---

# Introduction

This is the onboarding introduction for the ACM @ UC Merced Website. The website serves as the main online hub
for the ACM chapter at UC Merced.

## Prerequisites

There are some tools that you would need to have installed before you continue. They are listed below:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)

:::note

If you are unfamiliar with any of these tools, please take the time to read, and learn them. There is simply not enough time in order to cover them in the project.
You’ll also need to understand basic terminology such as forking, cloning, etc.

:::

:::tip

[Volta](https://volta.sh/) is recommended to be used for this project as it makes installing Node.js and configuring it painless.

:::

## Setup

**Node.js v20 or higher is required!**

:::note

There are some important notes that you must account for before reading the steps:

- The source code is located under the `react` directory. Thus, this directory will get referenced heavily.
- All code blocks use Bash. If you use a different shell (e.g Powershell), you may or may not need to adjust the commands accordingly

:::

1. Clone the repo from GitHub

```bash
git clone https://github.com/UCMercedACM/Chapter-Website \
&& cd Chapter-Website/react
```

2. Install all dependencies and set up [Lefthook](https://github.com/evilmartians/lefthook)

```bash
npm install \
&& lefthook install
```

3. Copy the `.env.example` file into an `.env`. Then modify as needed.

    `.env.example` --> `.env`

4. Run the dev server

```bash
npm run dev
```

## Database

The frontend React code doesn't use **any** sort of database. The database side is handled
in the backend Python FastAPI server.

:::note

Effectively the old production Firebase account is locked out because someone enabled 2FA on the Google
Account and now no one can log in.

:::

## Basic Concepts

The website is split into two components: the React frontend, and the Python backend. The frontend is the “face” of the website;
it’s primary role is to serve as the user interface for parts such as the landing page, events, etc.
The backend is handled by an custom FastAPI server, and is the main point of contact for retrieving, updating, adding and/or deleting data.

In this project, we will mostly focus on the frontend and parts of the backend that are relevant to the frontend (e.g such as the dashboard, etc).
It’s up to you to pick on which one you wish to contribute to. If you wish to delve deeper into them, the relevant guides are listed below:

- [Frontend](./frontend)
- [Backend](./backend)

It's also important to read the [Contributing](./contributing) guidelines, as they are recommendations on how you should contribute.
