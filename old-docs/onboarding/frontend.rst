========
Frontend
========

This document delves deeper into the frontend
of the website.

Frameworks
==========

The major framework used in the frontend is `React <https://react.dev/>`_, the de-facto
JavaScript framework for building interactive websites. React is a component-based, meaning that
each component is a self-contained unit that can be reused throughout the website. This makes it easier to re-use
parts of a website (e.g. a button or the navbar) and apply them in a consistent manner.

React does not handle the styling (aka the CSS), so we use `TailwindCSS <https://tailwindcss.com/>`_ in order
to build the styling. TailwindCSS is a utility-first CSS framework, meaning that it provides a set of CSS classes
that can be used to build the website. For example, we can use the class ``bg-red-500`` to set the background
color to a shade of red. The UI components such as buttons, are not provided by TailwindCSS, but can be built
using the provided classes.

.. note::

  It would be extremely helpful to learn how to use TailwindCSS, as
  there is simply not enough time to cover how to teach it within the project itself.

  It's not required to know how to use TailwindCSS, but it is highly recommended to understand
  how does it work before getting started.

Structure of The Website
========================

The website is structured as follows:

- Landing
- Events
- SIGs
- Dashboard

The landing page serves as the front face of the website. It contains a brief description of the club,
and the pitch and what does the club do. The events page contains a list of events that the club has
to offer. These are pulled from the database, and synced with the leadership's calendar for
scheduling purposes. The SIGs page contains a list of SIGs that the club has to offer. SIGs
are Student Interest Groups, and are split into different SIGs based on the field. Lastly,
the dashboard serves as a place for members to log in and view their membership status, as well
to schedule what workshops and events they are going to attend. The dashboard is only accessible
for UC Merced students, and also contains a points system in order to encourage members to
obtain more points and attend more events.

Each one of these pages share a set of common components, such as the navbar and the footer.

Design and Wireframing
======================

The design of the website was done using `Figma <https://figma.com/>`_. Members are not required
to know how to wireframe and design websites, but are expected to know how to use Figma in order
to implement the website. All designs will be handled by SIG Design.
