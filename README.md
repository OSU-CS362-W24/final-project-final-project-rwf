[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/PCWxquq3)
# CS 362 Final Project

This repository contains the application you will work with for the CS 362 final project.  The application code itself is written in the `src/` directory, but it is factored in such a way that the application cannot be run directly from the `src/` directory.  Instead, the app must be built before it can be run.

A build process is already configured for the application using a tool called [Webpack](https://webpack.js.org/).  This build process can be used in two different ways, described below.  In either case, make sure you run the following command first to install all the app's dependencies:
```
npm install
```

## Running the app through the development server

The app can be run through a development server that will automatically build the app and then serve it.  The development server can be started with the command:
```
npm start
```

Once the development server is running, it will print out an HTTP URL you can use to access the app through the development server.  The development server should automatically open this URL in your browser for you, but if it doesn't, you can copy/paste the URL into your browser to experiment with the app.  Running the app through the development server will also be the easiest way to run end-to-end tests against the app.  In other words, you can configure Cypress to connect to the app through the running development server.

## Building the app to files

Running the app through the development server will not produce any build files.  If you want to generate files containing the built application, you can do this by running the command:
```
npm run build
```

Running this command will generate a directory called `dist/` that will contain HTML and JS files comprising the built application.  These are the files you'll want to package for release and deploy in the CI/CD pipeline you build for the app.
