const Dirext = require('dirext-js');
const fs = require('fs');

const findGlobal = () => {
  const globalMiddleware = [];
  try {
    if (fs.existsSync('./controllers/global.js')) {
      globalMiddleware.push(...require('./controllers/global.js'));
    }
  } catch (err) {
    console.log(err);
  }
  return globalMiddleware;
};

const app = new Dirext();

module.exports = () => {
  function connext(req, res) {
    connext.invoker(req, res);
  }
  connext.routes = [];
  connext.globalMiddleware = findGlobal();
  connext.get = set.bind(connext, 'GET');
  connext.post = set.bind(connext, 'POST');
  connext.put = set.bind(connext, 'PUT');
  connext.patch = set.bind(connext, 'PATCH');
  connext.delete = set.bind(connext, 'DELETE');
  connext.head = set.bind(connext, 'HEAD');
  connext.connect = set.bind(connext, 'CONNECT');
  connext.options = set.bind(connext, 'OPTIONS');
  connext.trace = set.bind(connext, 'TRACE');
  connext.use = app.use.bind(connext);
  connext.routeSplitter = app.routeSplitter.bind(connext);
  connext.compareRoutes = app.compareRoutes.bind(connext);

  function set(...args) {
    app.set.apply(connext, args);
    return connext;
  }

  connext.invoker = function (req, res) {
    console.log('connext.routes is:', JSON.stringify(connext.routes));
    console.log('hitting invoker');
    // creating a variable to store user's exported array of global middleware functions
    // defining an error handler that can be overwritten if the user creates their own global error handling function
    let errorHandler = (err, req, res, next) => {
      res.status(500).send(`err: ${err}`);
    };
    // if the global middleware array exists and the last function in the array accepts 4 arguments (catch all error route), set errorHandler to that last function
    if (connext.globalMiddleware[connext.globalMiddleware.length - 1].length === 4) {
      errorHandler = connext.globalMiddleware.pop();
    }
    // if the global middleware array is not empty set const middleware to that array, otherwise set const middleware to an empty array
    let middleware = [];
    // deconstruct method and url out of req
    const { method, url } = req;
    // invoke this.find with method and url passed in as arguments at the key 'middleware' and set that to const targetMiddleware
    const targetMiddleware = app.find.apply(connext, [method, url]).middleware;
    console.log('targetMiddleware is: ', targetMiddleware);
    // push the spread array targetMiddleware into middleware array
    middleware.push(...connext.globalMiddleware, ...targetMiddleware);
    // counter to keep track of position of current middleware function
    console.log('middleware array is: ', middleware);
    let i = 0;
    // loop through middleware array and invoke each function in order. if an error is passed into next function return that error.
    async function next(err) {
      if (err) return errorHandler(err, req, res);
      // eslint-disable-next-line no-useless-catch
      while (i < middleware.length) {
        try {
          const currentMiddleware = middleware[i];
          if (i === middleware.length - 1) {
            middleware = [];
          }
          i += 1;
          return currentMiddleware(req, res, next);
        } catch (error) {
          return error;
        }
      }
      console.log('middleware after splice is:', middleware);
    }
    return next();
  };
  return connext;
};
