// /*eslint-disable*/
const Connext = require('../index.js');
const middleware = require('./testing-middleware.js');

const connext = Connext();

describe('connext middleware testing', () => {
  describe('single middleware function testing', () => {
    afterEach(() => {
      connext.routes = [];
    });

    it('should execute anonymous middleware', () => {
      const req = { method: 'DELETE', url: '/api/test' };
      const res = {};
      let result = 0;
      connext.delete('/api/test', (req, res, next) => {
        res.num = 10;
        result = res.num;
      });
      connext(req, res);
      expect(result).toEqual(10);
    })

    it('should update the response body given a single middleware function', () => {
      const req = { method: 'POST', url: '/api/test' };
      const res = {};
      let result = 0;
      connext.post('/api/test', middleware.addTwo, (req, res, next) => {
        result = res.num;
      });
      connext(req, res);
      expect(result).toEqual(2);
    });

    it('should update the response body given a different single middleware function', () => {
      const req = { method: 'POST', url: '/api/test' };
      const res = {};
      let result = 0;
      connext.post('/api/test', middleware.timesTwo, (req, res, next) => {
        result = res.num;
      });
      connext(req, res);
      expect(result).toEqual(4);
    });
  });

  describe('chained middleware function testing', () => {
    afterEach(() => {
      connext.routes = [];
    });

    it('should persist request and response through chained middleware calls', () => {
      const req = { method: 'GET', url: '/api/test' };
      const res = {};
      let result = 0;
      connext.get('/api/test', middleware.addTwo, middleware.timesTwo, (req, res, next) => {
        result = res.num;
      });
      connext(req, res);
      expect(result).toEqual(4);
    });

    it('should persist request and response through different chained middleware calls', () => {
      const req = { method: 'PATCH', url: '/api/test' };
      const res = {};
      let result = 0;
      connext.patch('/api/test', middleware.minusTwo, middleware.dividedTwo, (req, res, next) => {
        result = res.num;
      });
      connext(req, res);
      expect(result).toEqual(1);
    });

    it('should persist request and response through multiple middleware and anonymous function calls', () => {
      const req = { method: 'TRACE', url: '/api/test' };
      const res = {};
      let result = 0;
      connext.trace('/api/test', middleware.minusTwo, middleware.dividedTwo, (req, res, next) => {
        res.num += 1000;
        result = res.num;
      });
      connext(req, res);
      expect(result).toEqual(1001);

    });
  });
});
