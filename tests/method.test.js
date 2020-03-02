/*eslint-disable*/
const Connext = require('../index.js');

const connext = Connext();

describe('connext method tests', () => {
  describe('connext initialization testing', () => {
    it('routes should initialize as an empty array', () => {
      expect(connext.routes).toEqual([]);
    });

    it('connext should have all methods', () => {
      expect(connext.get).toBeTruthy();
      expect(connext.post).toBeTruthy();
      expect(connext.put).toBeTruthy();
      expect(connext.patch).toBeTruthy();
      expect(connext.delete).toBeTruthy();
      expect(connext.head).toBeTruthy();
      expect(connext.connect).toBeTruthy();
      expect(connext.options).toBeTruthy();
      expect(connext.trace).toBeTruthy();
      expect(connext.use).toBeTruthy();
      expect(connext.routeSplitter).toBeTruthy();
      expect(connext.compareRoutes).toBeTruthy();
    });
  }); 

  describe('static route testing', () => {
    afterEach(() => {
      connext.routes = [];
    });

    it('GET method should add static routes', () => {
      connext.get('/api/staticRoute', () => 'middleware 1');
      expect(connext.routes.length).toBe(1);
      expect(typeof connext.routes[0]).toBe('object');
      expect(connext.routes[0].method).toBe('GET');
      expect(connext.routes[0].url).toEqual([{ route: 'api' }, { route: 'staticRoute' }]);
      expect(connext.routes[0].middleware.length).toBe(1);
    });

    it('POST method should add static routes', () => {
      connext.post('/api/staticRoute', () => 'middleware 1');
      expect(connext.routes.length).toBe(1);
      expect(typeof connext.routes[0]).toBe('object');
      expect(connext.routes[0].method).toBe('POST');
      expect(connext.routes[0].url).toEqual([{ route: 'api' }, { route: 'staticRoute' }]);
      expect(connext.routes[0].middleware.length).toBe(1);
    });

    it('DELETE method should add static routes', () => {
      connext.delete('/api/staticRoute', () => 'middleware 1');
      expect(connext.routes.length).toBe(1);
      expect(typeof connext.routes[0]).toBe('object');
      expect(connext.routes[0].method).toBe('DELETE');
      expect(connext.routes[0].url).toEqual([{ route: 'api' }, { route: 'staticRoute' }]);
      expect(connext.routes[0].middleware.length).toBe(1);
    });

    it('PUT method should add static routes', () => {
      connext.put('/api/staticRoute', () => 'middleware 1');
      expect(connext.routes.length).toBe(1);
      expect(typeof connext.routes[0]).toBe('object');
      expect(connext.routes[0].method).toBe('PUT');
      expect(connext.routes[0].url).toEqual([{ route: 'api' }, { route: 'staticRoute' }]);
      expect(connext.routes[0].middleware.length).toBe(1);
    });

    it('PATCH method should add static routes', () => {
      connext.patch('/api/staticRoute', () => 'middleware 1');
      expect(connext.routes.length).toBe(1);
      expect(typeof connext.routes[0]).toBe('object');
      expect(connext.routes[0].method).toBe('PATCH');
      expect(connext.routes[0].url).toEqual([{ route: 'api' }, { route: 'staticRoute' }]);
      expect(connext.routes[0].middleware.length).toBe(1);
    });

    it('USE method should add static routes', () => {
      connext.use('/api/staticRoute', () => 'middleware 1');
      expect(connext.routes.length).toBe(1);
      expect(typeof connext.routes[0]).toBe('object');
      expect(connext.routes[0].method).toBe('');
      expect(connext.routes[0].url).toEqual([{ route: 'api' }, { route: 'staticRoute' }]);
      expect(connext.routes[0].middleware.length).toBe(1);
    });
  });

  describe('parameterized route testing', () => {
    afterEach(() => {
      connext.routes = [];
    });

    it('should handle single parameterized endpoint', () => {
      connext.get('/api/:id', () => 'middleware 1');
      expect(connext.routes.length).toBe(1);
      expect(connext.routes[0].url[1].param).toBeTruthy();
      expect(connext.routes[0].url[1].param).toBe('id');
    });
  
    it('should handle nested parameterized endpoints', () => {
      connext.get('/api/:id/:name', () => 'middleware 1');
      expect(connext.routes.length).toBe(1);
      expect(connext.routes[0].url.length).toBe(3);
      expect(connext.routes[0].url[1].param).toBe('id');
      expect(connext.routes[0].url[2].param).toBe('name');
    });

    it('should handle non-consecutive parameters', () => {
      connext.get('/api/:id/user/:name', () => 'middleware 1');
      expect(connext.routes.length).toBe(1);
      expect(connext.routes[0].url.length).toBe(4);
      expect(connext.routes[0].url[1].param).toBe('id');
      expect(connext.routes[0].url[2].route).toBeTruthy();
      expect(connext.routes[0].url[2].route).toBe('user');
      expect(connext.routes[0].url[3].param).toBe('name');
    });
  });
});
