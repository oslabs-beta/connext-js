/* eslint-disable class-methods-use-this */
/* eslint-disable no-continue */
class Dirext {
  constructor() {
    // an array of routes
    this.routes = [];

    // binding all HTTP req methods as methods on Dirext using bind and our set method
    this.get = this.set.bind(null, 'GET');
    this.post = this.set.bind(null, 'POST');
    this.put = this.set.bind(null, 'PUT');
    this.patch = this.set.bind(null, 'PATCH');
    this.delete = this.set.bind(null, 'DELETE');
    this.head = this.set.bind(null, 'HEAD');
    this.connect = this.set.bind(null, 'CONNECT');
    this.options = this.set.bind(null, 'OPTIONS');
    this.trace = this.set.bind(null, 'TRACE');
  }

  // a helper function that takes each segment of route and creates an array of key value pairs
  // edge case for global middleware
  routeSplitter(url) {
    if (url === '/' || url === '*' || url === 'global') return [{ route: url }];
    // split route on each / then map through elements
    const route = url.split('/').splice(1).map((elem) => {
      // if element is a param return an object with key param value elem
      if (elem[0] === ':') return { param: elem.slice(1) };
      // if element is a query string
      if (elem[0] === '?') {
        // split on & to seperate multiple queries
        const queryArr = elem.slice(1).split('&');
        // reduce query arr to an object holding key query which holds key value pairs of queries
        return queryArr.reduce((obj, query) => {
          if (!obj.query) obj.query = {};
          const split = query.split('=');
          obj.query[split[0]] = split[1];
          return obj;
        }, {});
      }
      // else return obj with key route and value of elem
      return { route: elem };
    });
    // return array of routes
    return route;
  }


  compareRoutes(currentRoute, splitRoute, loopLength = currentRoute.url.length) {
    const response = {
      match: true,
    };
    for (let j = 0; j < loopLength; j += 1) {
      // confirm that all route segment objects hold the same value
      if (currentRoute.url[j].route && splitRoute[j].route) {
        if (currentRoute.url[j].route === splitRoute[j].route) {
          continue;
        } else if (currentRoute.url[j].route === '*' && splitRoute[j].route !== undefined) {
          return response;
        } else {
          response.match = false;
          return response;
        }
      } else if (currentRoute.url[j].param && splitRoute[j].route) {
        // if there is a param in url route, save variable and value to params obj
        const variable = currentRoute.url[j].param;
        const value = splitRoute[j].route;
        splitRoute[j].params = { [variable]: value };
        if (!response.params) response.params = {};
        response.params[variable] = value;
        // delete route obj now that we know it's a param
        delete splitRoute[j].route;
        // store new param object on response
        continue;
        // logic for handling wildcard routes
      } else {
        response.match = false;
        return response;
      }
    }
    return response;
  }

  // method to add routes for router to recognize
  set(method, url, ...middlewareFuncs) {
    // array of middleware functions
    const middleware = [...middlewareFuncs];
    // push object with url, method, and middlware to routes
    this.routes.push({ url: this.routeSplitter(url), method, middleware });
    return this;
  }

  // method to add middleware to routes without specific http req method
  use(url, ...middlewareFuncs) {
    if (typeof url !== 'string') {
      middlewareFuncs = [url];
      url = 'global';
    }
    // array of middleware funcs
    const middleware = [...middlewareFuncs];
    // push obect with url, method, and middleware to routes
    this.routes.push({ url: this.routeSplitter(url), method: '', middleware });
    return this;
  }

  find(method, url) {
    // parse input route using routeSplitter helper function
    const splitRoute = this.routeSplitter(url);
    // initialize empty array to push middleware to
    const response = {
      middleware: [],
      params: {},
    };

    // initialize loopLength variable
    let loopLength;
    // check if input route contains a query at the end
    if (splitRoute[splitRoute.length - 1].query) {
      // assign query object to response object
      response.query = splitRoute[splitRoute.length - 1].query;
      // don't compare last obj in route array
      loopLength = splitRoute.length - 1;
    } else {
      loopLength = splitRoute.length;
    }
    for (let i = 0; i < this.routes.length; i += 1) {
      const currentRoute = this.routes[i];
      // check if the route at i has a url of "global"
      if (currentRoute.url[0].route === 'global') {
        // if it does, push it to the middleware
        response.middleware.push(...currentRoute.middleware);
      }
      // check if the route at index i has a method
      else if (!currentRoute.method) {
        // if there is no method, push middleware and break out of the loop
        response.middleware.push(...currentRoute.middleware);
        break;
      }
      // otherwise compare the length of the two routes
      else if (currentRoute.url.length === loopLength && currentRoute.method === method) {
        // if they do match, push middleware to middleware array
        const result = this.compareRoutes(currentRoute, splitRoute, loopLength); // set default parameter for loop length? don't use it if it's a wildcard?
        if (result.match) {
          response.middleware.push(...currentRoute.middleware);
          if (result.params) response.params = { ...result.params };
        }
      } else {
        // loop through currentRoute and compare each index with splitRoute
        const result = this.compareRoutes(currentRoute, splitRoute);
        if (result.match) {
          response.middleware.push(...currentRoute.middleware);
          if (result.params) response.params = { ...result.params };
        }
      }
    }
    return response;
  }
}

module.exports = Dirext;
