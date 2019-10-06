const { check } = require("../controllers/coupons");
const { isLogin } = require("../middlewares/isAuth");

module.exports = router => {
  router.get("/:code", isLogin, check);
};
