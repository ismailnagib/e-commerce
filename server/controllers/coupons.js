const Coupon = require("../models/couponModel");
const { httpStatus } = require('../config/code');

module.exports = {
  addR: function(code, discount, id) {
    Coupon.create({
      code: code,
      discount: discount,
      validUser: id
    })
      .then(data => {
        return data.code;
      })
      .catch(err => {
        return err;
      });
  },

  check: function(req, res) {
    Coupon.findOne({
      code: req.params.code,
      validUser: req.userId
    })
      .then(data => {
        return res.status(httpStatus.ok).json(data);
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err });
      });
  },

  use: function(req, res) {
    Coupon.deleteOne({
      code: req.params.code,
      validUser: req.userId
    })
      .then(() => {
        return res.status(httpStatus.ok).json({});
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err });
      });
  }
};
