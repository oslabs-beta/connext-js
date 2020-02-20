class Connext {
  constructor() {
    this.routes = [];
    this.set = app.set.bind(this);
    this.get = this.set.bind(this, 'GET');
    this.post = this.set.bind(this, 'POST');
    this.put = this.set.bind(this, 'PUT');
    this.patch = this.set.bind(this, 'PATCH');
    this.delete = this.set.bind(this, 'DELETE');
    this.head = this.set.bind(this, 'HEAD');
    this.connect = this.set.bind(this, 'CONNECT');
    this.options = this.set.bind(this, 'OPTIONS');
    this.trace = this.set.bind(this, 'TRACE');
    this.find = app.find.bind(this);
    this.compareRoutes = app.compareRoutes.bind(this);
    this.routeSplitter = app.routeSplitter.bind(this);
    this.use = app.use.bind(this);
  }


  invoker(req, res) {
    console.log('this.routes is:', this.routes);
    console.log('hitting invoker');
    // creating a variable to store user's exported array of global middleware functions
    const global = require('../../pages/api/global');
    // defining an error handler that can be overwritten if the user creates their own global error handling function
    let errorHandler;
    // if the global middleware array exists and the last function in the array accepts 4 arguments (catch all error route), set errorHandler to that last function
    if (global[0] && global[global.length - 1].length === 4) errorHandler = global.pop();
    // if the global middleware array is not empty set const middleware to that array, otherwise set const middleware to an empty array
    const middleware = global[0] ? global : [];
    // deconstruct method and url out of req
    const { method, url } = req;
    console.log('req.url is: ', req.url);
    console.log('req.method is: ', req.method);
    // invoke this.find with method and url passed in as arguments at the key 'middleware' and set that to const targetMiddleware
    const targetMiddleware = this.find(method, url).middleware;
    console.log('targetMiddleware is: ', targetMiddleware);
    console.log(this.find);
    // push the spread array targetMiddleware into middleware array
    middleware.push(...targetMiddleware);
    // counter to keep track of position of current middleware function
    console.log('middleware array is: ', middleware);
    let i = 0;
    // loop through middleware array and invoke each function in order. if an error is passed into next function return that error.
    async function next(err) {
      if (err) return res.json(err);
      // eslint-disable-next-line no-useless-catch
      try {
        const currentMiddleware = middleware[i];
        i += 1;
        await currentMiddleware(req, res, next);
        return next();
      } catch (error) {
        return error;
      }
    }
    return next();
  }
}
