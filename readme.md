[![Build Status](https://travis-ci.org/DEFRA/hapi-api-boilerplate.svg?branch=master)](https://travis-ci.org/DEFRA/hapi-api-boilerplate) [![Maintainability](https://api.codeclimate.com/v1/badges/c1b6847c119ba19a8ae3/maintainability)](https://codeclimate.com/github/DEFRA/hapi-api-boilerplate/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/c1b6847c119ba19a8ae3/test_coverage)](https://codeclimate.com/github/DEFRA/hapi-api-boilerplate/test_coverage) [![Greenkeeper badge](https://badges.greenkeeper.io/DEFRA/hapi-api-boilerplate.svg)](https://greenkeeper.io/)

# (Enter service name)
(Description of the service)

# Environment variables
(Be sure to describe any environment variables here by maintaining a list like this)

| name     | description      | required | default |            valid            | notes |
|----------|------------------|:--------:|---------|:---------------------------:|-------|
| NODE_ENV | Node environment |    no    |         | development,test,production |       |
| PORT     | Port number      |    no    | 3000    |                             |       |

# Prerequisites

Node v8+


# (Checklist)
Once you clone this repository you'll need to make a few changes before you're ready to start:

- [ ] Add service name and description to the README above
- [ ] Update the `package.json` with the name, description and any git urls and authors etc.  
- [ ] Remove the .git folder in the root directory. This will cut the cord to this boilerplate repo.
- [ ] Update the build status badges for your new project

# Running the application

`$ node index.js`


(You can delete the remainder of this readme once you're up and running)

## What is this?

A simple hapi-based enterprise ready API application boilerplate.
Click here for a similar [web boilerplate hapi project](https://github.com/DEFRA/hapi-web-boilerplate).

Based on:

- [hapijs](https://github.com/hapijs/hapi) - The framework & core plugins like `joi`, `h2o2` etc.
- [standardjs](http://standardjs.com/) - Linting
- [npm-scripts](https://docs.npmjs.com/misc/scripts) - Build tool
- [pm2](https://github.com/Unitech/pm2) - Process manager


## Getting started

Clone this repo and run through the checklist above.

Check the server is running by pointing your browser to `http://localhost:3000`

## Project structure

Here's the default structure for your project files.

* **server**
  * **plugins**
  * **routes**
  * config.js
  * index.js (Exports a function that creates a server)
* **test**
* README.md
* index.js (startup server)

## Config

The configuration file for the server is found at `server/config.js`.
This is where to put any config and all config should be read from the environment.
The final config object should be validated using joi and the application should not start otherwise.

A table of environment variables should be maintained in this README.

## Plugins

hapi has a powerful plugin system and all server code should be loaded in a plugin.

Plugins live in the `server/plugins` directory.

## Logging

The [good](https://github.com/hapijs/good) and [good-console](https://github.com/hapijs/good-console) plugins are included and configured in `server/plugins/logging`

The logging plugin is only registered in when `NODE_ENV=development`.

Error logging for production should use errbit.

## Routes

Incoming requests are handled by the server via routes. 
Each route describes an HTTP endpoint with a path, method, and other properties.

Routes are found in the `server/routes` directory and loaded using the `server/plugins/router.js` plugin.

Hapi supports registering routes individually or in a batch.
Each route file can therefore export a single route object or an array of route objects.

A single route looks like this:

```js
{
  method: 'GET',
  path: '/hello-world',
  options: {
    handler: (request, h) => {
      return 'hello world'
    }
  }
}
```

There are lots of [route options](http://hapijs.com/api#route-options), here's the documentation on [hapi routes](http://hapijs.com/tutorials/routing)

## Tasks

Build tasks are created using simple shell scripts or node.js programs.
The default ones are found in the `bin` directory.

The task runner is simply `npm` using `npm-scripts`.

We chose to use this for simplicity but there's nothing to stop you adding `gulp`, `grunt` or another task runner if you prefer. 

The predefined tasks are:

- `npm run lint` (Runs the lint task using standard.js)
- `npm run unit-test` (Runs the `lab` tests in the `/test` folder)
- `npm test` (Runs the `lint` task then the `unit-tests`)

### Resources

For more information around using `npm-scripts` as a build tool:

- http://substack.net/task_automation_with_npm_run
- http://ponyfoo.com/articles/choose-grunt-gulp-or-npm
- http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/
- http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/

## Testing

[lab](https://github.com/hapijs/lab) and [code](https://github.com/hapijs/code) are used for unit testing.

See the `/test` folder for more information.

## Linting

[standard.js](http://standardjs.com/) is used to lint both the server-side and client-side javascript code.

It's defined as a build task and can be run using `npm run lint`.
