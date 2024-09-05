=======
Backend
=======

Frameworks
==========

The backend is built using `Firebase <https://firebase.google.com/>`_.
Firebase handles most backend logic, such as user authentication, database, etc.

.. important::

  The choice of database is not final. If you have any suggestions, please
  let the webmaster know.

Interacting with Firebase
=========================

In order to use the development database, first contact the webmaster in
order to obtain the Firebase API key. This will be securely sent to you.
**Please make sure you don't share this key with anyone else.**

The client is already set up. Note that the client referenced
in the Firebase documentation is the **Web Modular API**.

Examples
--------

**This demonstration uses Node.js, not React**

As an example, let's say we want to add a new user to the database.
Before getting started, make sure you have the Firebase API key, and
set your script up as follows:


.. code-block:: javascript

    initializeApp();

    const db = getFirestore();

`Reference Snippet (init) <https://github.com/firebase/snippets-node/blob/e29c2c3ced6c1a3cb14ad5ab7588dac578c06453/firestore/main/index.js#L45-L48>`_

Now, let's add a new user to the database:

.. code-block:: javascript

  const docRef = db.collection('users').doc('alovelace');

  await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
  });

`Reference Snippet (adding) <https://github.com/firebase/snippets-node/blob/e29c2c3ced6c1a3cb14ad5ab7588dac578c06453/firestore/main/index.js#L86-L92>`_

Now we can read the database

.. code-block:: javascript

  const snapshot = await db.collection('users').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });

`Reference Snippet (reading) <https://github.com/firebase/snippets-node/blob/e29c2c3ced6c1a3cb14ad5ab7588dac578c06453/firestore/main/index.js#L119-L122>`_

For more information, see the `Firebase Documentation <https://firebase.google.com/docs/firestore/quickstart>`_.
