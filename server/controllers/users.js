const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const { addR } = require("../controllers/coupons");
const { httpStatus } = require('../config/code');


const sendCoupon = async (data) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++) {
    text += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }

  addR(text, 50, data._id);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.BACKGROUND_JOB_EMAIL_ADDRESS,
      pass: process.env.BACKGROUND_JOB_EMAIL_PASSWORD
    }
  });

  let mailOptions = {
    from: "Shoeka",
    to: data.email,
    subject: "Welcome!",
    html: `
      <h3>Hi, ${data.name}</h3>
      <p>As a new member of our family, we would like to give you a special discount coupon, please
      note that the coupon below will only apply to the account registered with this email.</p><br>
      <h2 style='text-align: center'>${text}</h2><br>
      <h3>Happy shopping,</h3>
      <h3><b>Shoeka - Cause there's always a better shoes</b></h3>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    return console.log("Message sent to ", mailOptions.to);
  });
}

module.exports = {
  show: function(req, res) {
    User.find({})
      .then(data => {
        return res.status(httpStatus.ok).json({ data: data });
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  add: function(req, res) {
    User.findOne({ email: req.body.email })
      .then(data => {
        if (data) {
          res
            .status(httpStatus.internalServerError)
            .json({ message: "The email has been registered before." });
        } else {
          let hashedPassword = bcrypt.hashSync(req.body.password);
          User.create({
            email: req.body.email,
            password: hashedPassword
          })
            .then(() => {
              return res.status(201).json({ message: "New user added." });
            })
            .catch(err => {
              return res.status(httpStatus.internalServerError).json({ message: err.message || err });
            });
        }
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  edit: function(req, res) {
    let hashedPassword = bcrypt.hashSync(req.body.password);
    User.updateOne(
      {
        _id: req.params.id
      },
      {
        email: req.body.email,
        password: hashedPassword
      }
    )
      .then(() => {
        return res.status(httpStatus.ok).json({ message: `User ${req.params.id} updated.` });
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  remove: function(req, res) {
    User.deleteOne({
      _id: req.params.id
    })
      .then(() => {
        return res.status(httpStatus.ok).json({ message: `User '${req.params.id}' deleted.` });
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  login: function(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(httpStatus.internalServerError).json({ message: "Please input your email and password" });
    } else {
      User.findOne({
        email: req.body.email
      })
        .then(user => {
          if (user) {
            if (user.gSignIn === 0) {
              let passwordValid = bcrypt.compareSync(
                req.body.password.toString(),
                user.password
              );
              if (passwordValid) {
                let token = jwt.sign(
                  { id: user._id, isAdmin: user.isAdmin },
                  process.env.JWT_KEY
                );
                res
                  .status(httpStatus.ok)
                  .json({ token: token, id: user._id, isAdmin: user.isAdmin });
              } else {
                res
                  .status(httpStatus.internalServerError)
                  .json({ message: "Incorrect email and/or password" });
              }
            } else {
              res
                .status(httpStatus.internalServerError)
                .json({ message: "Sorry, but you should sign in with Google" });
            }
          } else {
            res
              .status(httpStatus.internalServerError)
              .json({ message: "Incorrect email and/or password" });
          }
        })
        .catch(err => {
          return res.status(httpStatus.internalServerError).json({ message: err.message || err });
        });
    }
  },

  register: function(req, res) {
    if (/\S+@\S+\.\S+/.test(req.body.email) === false) {
      return res.status(httpStatus.internalServerError).json({ message: "Please input a valid email address" });
    } else {
      var hashedPassword = bcrypt.hashSync(req.body.password);
      if (req.body.name && req.body.password) {
        User.findOne({
          email: req.body.email
        })
          .then(data => {
            if (data) {
              res
                .status(httpStatus.internalServerError)
                .json({ message: "Email has been registered before" });
            } else {
              if (req.body.password.length >= 6) {
                User.create({
                  name: req.body.name,
                  email: req.body.email,
                  password: hashedPassword
                })
                  .then(data => {
                    sendCoupon(data)
                    return res.status(201).json({ message: 'Email registration successful. Please sign in to continue.' })
                  })
                  .catch(err => {
                    return res.status(httpStatus.internalServerError).json({
                      message:
                        "An error occured during the registration process. Please try again later."
                    });
                  });
              } else {
                return res.status(httpStatus.internalServerError).json({
                  message: "Password should contain at least 6 characters"
                });
              }
            }
          })
          .catch(err => {
            return res.status(httpStatus.internalServerError).json({
              message:
                "An error occured during the registration process. Please try again later."
            });
          });
      } else {
        return res.status(httpStatus.internalServerError).json({ message: "Please fill all the fields" });
      }
    }
  },

  getCart: function(req, res) {
    User.findById(req.userId)
      .populate("items")
      .then(data => {
        return res.status(httpStatus.ok).json({
          items: data.items,
          counts: data.counts,
          total: data.total,
          totalsum: data.totalsum
        });
      })
      .catch(err => {
        return res.status(httpStatus.ok).json({ message: err.message || err });
      });
  },

  updateCart: function(req, res) {
    var items = req.body.items;
    var counts = req.body.counts;
    var total = [];
    var totalsum = 0;
    Product.find({
      _id: {
        $in: items
      }
    })
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          total.push(data[i].price * counts[i]);
          totalsum += data[i].price * counts[i];
        }
        User.updateOne(
          {
            _id: req.userId
          },
          {
            items: items,
            counts: counts,
            total: total,
            totalsum: totalsum
          }
        )
          .then(() => {
            return res.status(httpStatus.ok).json({});
          })
          .catch(err => {
            return res.status(httpStatus.internalServerError).json({ message: err.message || err });
          });
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  checkout: function(req, res) {
    Coupon.findOne({
      code: req.body.coupon
    }).then(coupon => {
      let discount = 0;
      if (coupon) {
        discount = coupon.discount;
      }

      User.findById(req.userId)
        .then(data => {
          let transaction = data.transaction;
          let boughtProducts = data.boughtProducts;

          transaction.push({
            cart: {
              items: data.items,
              counts: data.counts,
              total: data.total,
              totalsum: (data.totalsum * (100 - discount)) / 100,
              discount: (data.totalsum * discount) / 100
            },
            date: new Date()
          });

          for (let i = 0; i < data.items.length; i++) {
            if (boughtProducts.indexOf(data.items[i]) === -1) {
              boughtProducts.push(data.items[i]);
            }
          }

          User.updateOne(
            {
              _id: req.userId
            },
            {
              transaction: transaction,
              items: [],
              counts: [],
              total: [],
              totalsum: 0,
              boughtProducts: boughtProducts
            }
          )
            .then(() => {
              if (coupon) {
                Coupon.deleteOne({
                  code: req.body.coupon
                })
                  .then(() => {
                    return res.status(httpStatus.ok).json({});
                  })
                  .catch(err => {
                    return res.status(httpStatus.internalServerError).json({ message: err.message || err });
                  });
              } else {
                return res.status(httpStatus.ok).json({});
              }
            })
            .catch(err => {
              return res.status(httpStatus.internalServerError).json({ message: err.message || err });
            });
        })
        .catch(err => {
          return res.status(httpStatus.internalServerError).json({ message: err.message || err });
        });
    });
  },

  getTransactions: function(req, res) {
    User.findById(req.userId)
      .populate("transaction.cart.items")
      .then(data => {
        return res.status(httpStatus.ok).json(data.transaction);
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  },

  promote: function(req, res) {
    User.findOne({
      email: req.body.email
    })
      .then(user => {
        if (user) {
          if (user.isAdmin === 1) {
            return res.status(httpStatus.internalServerError).json({
              message: `${user.name} (${req.body.email}) is registered as an admin, there's no need for a promotion.`
            });
          } else {
            User.updateOne(
              {
                email: req.body.email
              },
              {
                isAdmin: 1
              }
            )
              .then(() => {
                return res.status(httpStatus.ok).json({
                  message: `${user.name} (${req.body.email}) has been successfully promoted.`
                });
              })
              .catch(err => {
                return res.status(httpStatus.internalServerError).json({ message: err.message || err });
              });
          }
        } else {
          return res.status(httpStatus.internalServerError).json({
            message:
              "Sorry, but we couldn't find anyone registered with that email."
          });
        }
      })
      .catch(err => {
        return res.status(httpStatus.internalServerError).json({ message: err.message || err });
      });
  }
};
