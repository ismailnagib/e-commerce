const jwt = require("jsonwebtoken");

module.exports = {
  isLogin: function(req, res, next) {
    jwt.verify(req.headers.token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        next(err.message);
      } else {
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin === 1;
        next();
      }
    });
  },

  isAdmin: function(req, res, next) {
    next(req.isAdmin ? null : 'Access denied')
  }
};
