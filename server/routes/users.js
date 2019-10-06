const {
  show,
  add,
  edit,
  remove,
  login,
  register,
  getCart,
  updateCart,
  checkout,
  getTransactions,
  promote
} = require("../controllers/users");
const { isLogin, isAdmin } = require("../middlewares/isAuth");
const { httpStatus } = require('../config/code');

module.exports = router => {
  router.get("/", isLogin, isAdmin, show);
  router.post("/", isLogin, isAdmin, add);
  router.put("/", isLogin, edit);
  router.delete("/", isLogin, isAdmin, remove);
  router.get("/cart", isLogin, getCart);
  router.patch("/cart", isLogin, updateCart);
  router.get("/ph", isLogin, getTransactions);
  router.post("/login", login);
  router.post("/register", register);
  router.get("/check", isLogin, (req, res) =>
    res
      .status(httpStatus.ok)
      .json({ isLogin: true, id: req.userId, isAdmin: req.isAdmin })
  );
  router.patch("/checkout", isLogin, checkout);
  router.patch("/promote", isLogin, isAdmin, promote);
};
