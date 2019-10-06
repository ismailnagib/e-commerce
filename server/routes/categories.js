const { show, add, edit, remove } = require("../controllers/categories");
const { isLogin, isAdmin } = require("../middlewares/isAuth");

module.exports = router => {
  router.get("/", show);
  router.post("/", isLogin, isAdmin, add);
  router.put("/:id", isLogin, isAdmin, edit);
  router.delete("/:id", isLogin, isAdmin, remove);
};
