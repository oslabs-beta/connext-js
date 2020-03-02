var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Dirext = require('dirext-js');
var fs = require('fs');
var findGlobal = function () {
    var globalMiddleware = [];
    try {
        if (fs.existsSync('../../controllers/global.js')) {
            globalMiddleware.push.apply(globalMiddleware, require('../../controllers/global.js'));
        }
    }
    catch (err) {
        console.log(err);
    }
    return globalMiddleware;
};
var app = new Dirext();
module.exports = function () {
    function connext(req, res) {
        connext.invoker(req, res);
    }
    connext.routes = [];
    connext.globalMiddleware = findGlobal();
    connext.get = set.bind(connext, 'GET');
    connext.post = set.bind(connext, 'POST');
    connext.put = set.bind(connext, 'PUT');
    connext.patch = set.bind(connext, 'PATCH');
    connext["delete"] = set.bind(connext, 'DELETE');
    connext.head = set.bind(connext, 'HEAD');
    connext.connect = set.bind(connext, 'CONNECT');
    connext.options = set.bind(connext, 'OPTIONS');
    connext.trace = set.bind(connext, 'TRACE');
    connext.use = app.use.bind(connext);
    connext.routeSplitter = app.routeSplitter.bind(connext);
    connext.compareRoutes = app.compareRoutes.bind(connext);
    function set() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        app.set.apply(connext, args);
        return connext;
    }
    connext.invoker = function (req, res) {
        // creating a variable to store user's exported array of global middleware functions
        // defining an error handler that can be overwritten if the user creates their own global error handling function
        var errorHandler = function (err, req, res, next) {
            res.status(500).send("err: " + err);
        };
        // if the global middleware array exists and the last function in the array accepts 4 arguments (catch all error route), set errorHandler to that last function
        if (connext.globalMiddleware.length > 0 && connext.globalMiddleware[connext.globalMiddleware.length - 1].length === 4) {
            errorHandler = connext.globalMiddleware.pop();
        }
        // if the global middleware array is not empty set const middleware to that array, otherwise set const middleware to an empty array
        var middleware = [];
        // deconstruct method and url out of req
        var method = req.method, url = req.url;
        // invoke this.find with method and url passed in as arguments at the key 'middleware' and set that to const targetMiddleware
        var targetMiddleware = app.find.apply(connext, [method, url]).middleware;
        // push the spread array targetMiddleware into middleware array
        middleware.push.apply(middleware, __spreadArrays(connext.globalMiddleware, targetMiddleware));
        // counter to keep track of position of current middleware function
        var i = 0;
        // loop through middleware array and invoke each function in order. if an error is passed into next function return that error.
        function next(err) {
            return __awaiter(this, void 0, void 0, function () {
                var currentMiddleware;
                return __generator(this, function (_a) {
                    if (err)
                        return [2 /*return*/, errorHandler(err, req, res, next)];
                    // eslint-disable-next-line no-useless-catch
                    while (i < middleware.length) {
                        try {
                            currentMiddleware = middleware[i];
                            if (i === middleware.length - 1) {
                                middleware = [];
                            }
                            i += 1;
                            return [2 /*return*/, currentMiddleware(req, res, next)];
                        }
                        catch (error) {
                            return [2 /*return*/, error];
                        }
                    }
                    return [2 /*return*/];
                });
            });
        }
        return next();
    };
    return connext;
};
