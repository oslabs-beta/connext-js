const middleware = {};

middleware.addTwo = (req, res, next) => {
  console.log('add two is running');
  if (res.num) res.num += 2;
  else res.num = 2;
  return next();
};

middleware.timesTwo = (req, res, next) => {
  if (res.num) res.num *= 2;
  else res.num = 4;
  return next();
};

middleware.dividedTwo = (req, res, next) => {
  if (res.num) res.num /= 2;
  else res.num = 2;
  return next();
};

middleware.minusTwo = (req, res, next) => {
  if (res.num) res.num -= 2;
  else res.num = 2;
  return next();
};

module.exports = middleware;
