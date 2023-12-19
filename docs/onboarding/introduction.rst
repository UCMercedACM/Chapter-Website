============
Introduction
============

This the onboarding introduction for the UCMACM Website. The website serves
as the main online hub for the ACM chapter at UC Merced.

Prerequisites
=============

Before getting started, there are several tools
that you need to be familiar with and have installed. These are noted below.

- `Git <https://git-scm.com/>`_ and `GitHub <https://github.com>`_
- `TypeScript <https://www.typescriptlang.org/>`_
- `Node.js <https://nodejs.org/en>`_
- `npm <https://www.npmjs.com/>`_ (v9) or `yarn <https://yarnpkg.com/>`_ (v4)

.. note::

  If you are unfamiliar with any of these tools, please take the time to
  read, and learn them. There is simply not enough time in order to cover them
  in the project. You'll also need to understand basic terminology such as forking,
  cloning, etc.

  ``npm`` comes bundled with Node.js. If you want to use ``yarn``
  (cannot use both; must be one or the other), you can install it
  `here <https://yarnpkg.com/getting-started/install>`_


Setup
=====

**The UCMACM Website requires Node.js v20 or higher.**

.. important::

  There are some important notes that you must account for
  before reading the steps:

  1. The project is located under ``react/ucmacm-website``.This is the directory that you will be working in during this process

  2. The base repo is ``UCMercedACM/Chapter-Website``

  3. All code blocks use Bash. If you use a different shell (e.g Powershell), you may or may not need to adjust the commands accordingly

  4. In this example, ``npm`` is used as the package manager. If you would prefer to use ``yarn``, replace the ``npm`` commands with those for ``yarn``

1. Fork the repository on GitHub. An example command is provided below
(replace ``<username>`` with your GitHub account username
that forked the base repo)

.. code:: bash

  git clone https://github.com/<username>/Chapter-Website \
  && cd Chapter-Website/react/ucmacm-website

2. Install all dependencies and set up pre-commit hooks

.. code:: bash

  npm install \
  && npm run setup-pch

3. Copy the ``.env.example`` file to ``.env`` and modify in the appropriate values

.. code:: bash

  cp .env.example .env

4. In order to demonstrate, you can run the development server to test everything out

.. code:: bash

  npm run dev

Database
--------

Primer
^^^^^^

The database used for the website is `Firebase <https://firebase.google.com/>`_ (may change later).
Firebase works as a NoSQL database, storing data in JSON format. Just like most NoSQL databases
(such as MongoDB), each entry is stored as a document, and those are grouped in collections.
Most importantly, NoSQL databases are **schema-less**, meaning that the data
is not bound to a strict schema (e.g the columns on a Excel spreadsheet or a table of a SQL database).

.. important::

  The previous database used on the old website
  is Firebase. Chances are, the database used will more than likely
  change for the rewrite.

Obtaining the Firebase key
^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Ask Noelle for the Firebase key. This will be securely sent to you through DMs.
**DO NOT** share this key with anyone else!

2. Add the key to your ``.env`` file. The key-value pair should look like this:

.. code:: bash

  FIREBASE_KEY=<your key>

Basic Concepts
==============

This website is split into two components: the frontend and backend.
The frontend is the "face" of the website; it's primary role is to serve
as the user interface for parts such as the landing page, events, etc.
The backend is handled by Firebase, and is the main storage of processing
and storing data.

In this project, we will mostly focus on the frontend and
parts of the backend that are relevant to the frontend
(e.g such as the dashboard, etc). It's up to you to pick
on which one you wish to contribute to. If you wish to delve deeper into them,
the relevant guides are listed below:

- :doc:`frontend`
<<<<<<< HEAD
=======
- :doc:`backend`

It is also important to read the :doc:`contributing` guidelines,
as they are recommendations on how you should contribute.
>>>>>>> react-rewrite
