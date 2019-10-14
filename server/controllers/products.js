const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const { httpStatus } = require('../config/code');

module.exports = {
  showAll: function(req, res) {
    Product.find({})
      .populate("category")
      .then(data => {
        return res.status(httpStatus.ok).json(data);
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  showByCategory: function(req, res) {
    Product.find({
      category: req.params.category
    })
      .populate("category")
      .then(data => {
        return res.status(httpStatus.ok).json(data);
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  search: function(req, res) {
    Product.find({
      name: new RegExp(req.query.keyword, "i")
    })
      .populate("category")
      .then(data => {
        return res.status(httpStatus.ok).json(data);
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({
          message: err.message || err + " --> in other words, we can't find what you want"
        });
      });
  },

  add: function(req, res) {
    Category.findOne({
      name: req.body.category
    })
      .then(category => {
        if (category) {
          Product.findOne({ name: req.body.name })
            .then(data => {
              if (data) {
                res
                  .status(httpStatus.internalServerError)
                  .json({ message: "The product has been registered before." });
              } else {
                Product.create({
                  name: req.body.name,
                  description: req.body.description,
                  backtext: req.body.backtext,
                  price: req.body.price,
                  image: req.body.image,
                  category: category._id
                })
                  .then(() => {
                    return res.status(201).json({ message: "New product added." });
                  })
                  .catch(err => {
                    return res.status(httpStatus.internalServerError).json({ message: err.message || err });
                  });
              }
            })
            .catch(err => {
              return res.status(httpStatus.internalServerError).json({ message: err.message || err });
            });
        } else {
          return res.status(httpStatus.internalServerError).json({ message: "The category is unregistered." });
        }
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  edit: function(req, res) {
    Category.findOne({
      name: req.body.category
    })
      .then(category => {
        if (category) {
          Product.findOne({
            name: req.body.name,
            _id: {
              $ne: req.params.id
            }
          })
            .then(data => {
              if (data) {
                return res.status(httpStatus.internalServerError).json({
                  message: "There has been a product with a same name."
                });
              } else {
                Product.updateOne(
                  {
                    _id: req.params.id
                  },
                  {
                    name: req.body.name,
                    description: req.body.description,
                    backtext: req.body.backtext,
                    price: req.body.price,
                    category: category._id
                  }
                )
                  .then(() => {
                    res
                      .status(httpStatus.ok)
                      .json({ message: `Product '${req.params.id}' updated.` });
                  })
                  .catch(err => {
                    return res.status(httpStatus.internalServerError).json({ message: err.message || err });
                  });
              }
            })
            .catch(err => {
              return res.status(httpStatus.internalServerError).json({ message: err.message || err });
            });
        } else {
          return res.status(httpStatus.internalServerError).json({ message: "The category is unregistered." });
        }
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  remove: function(req, res) {
    Product.deleteOne({
      _id: req.params.id
    })
      .then(() => {
        res
          .status(httpStatus.ok)
          .json({ message: `Product '${req.params.id}' deleted.` });
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  rate: function(req, res) {
    User.findById(req.userId).then(user => {
      if (user.boughtProducts.indexOf(req.params.id) !== -1) {
        Product.findById(req.params.id)
          .then(data => {
            let ratedBy = data.ratedBy;
            if (ratedBy.indexOf(req.userId) === -1) {
              let ratings = data.ratings;

              ratedBy.push(req.userId);
              ratings.push(req.body.rate);

              let ratingsSum = (a, b) => a + b;

              let rating = ratings.reduce(ratingsSum) / ratedBy.length;

              Product.updateOne(
                {
                  _id: req.params.id
                },
                {
                  ratedBy: ratedBy,
                  ratings: ratings,
                  rating: rating
                }
              )
                .then(() => {
                  return res.status(httpStatus.ok).json({});
                })
                .catch(err => {
                  return res.status(httpStatus.internalServerError).json({ message: err.message || err });
                });
            } else {
              res
                .status(httpStatus.internalServerError)
                .json({ message: "You've rated the product before" });
            }
          })
          .catch(err => {
            return res.status(httpStatus.internalServerError).json({ message: err.message || err });
          });
      } else {
        return res.status(httpStatus.internalServerError).json({
          message: "You've never bought this product, so you can't rate it"
        });
      }
    });
  }
};
