### Express Quickstart Boiler
***

Inspired by [mean.js](meanjs.org).  This boiler uses config methods and the entire /user api from mean.js.  This includes authorization and authentication strategies using Passport.

Environment variables is pulled using [dotenv](https://www.npmjs.org/package/dotenv).  Don't forget to add your .env file to root.  We are only using this for our Session secret at the moment.

***
Run `gulp default` to build the front end.  Gulp is watching for any changes on these files.  
***

Browserify is compiling js from `app.js` in our public directory.  This is our front end entry point.  We can build using any framework from here on utilizing Bower for installation.  

When installing with Bower be sure to add package paths to `./config/env/default.js` under it's relative "lib" block (css or js).  This is for development environments to serve vendor files.  On NODE_ENV=production, we serve our files (w/ sourcemaps) along with any vendors concated & minified.  Note** some libs or frameworks may need to be shimmed for deps.

***
Todo:
***
* Implement live reload and nodemon on Gulp watch.
* Gulp logs on file change.
* CSRF on all forms
* Write more tests w/ Mocha.  Decide if using must.js or switching back to Chai.
* other stuff...
