const {
  showAll,
  showByCategory,
  search,
  add,
  edit,
  remove,
  rate
} = require("../controllers/products");
const { isLogin, isAdmin } = require("../middlewares/isAuth");

module.exports = router => {
  router.get("/", showAll);
  router.get("/search", search);
  router.get("/:category", showByCategory);
  router.post("/", isLogin, isAdmin, add);
  router.put("/:id", isLogin, isAdmin, edit);
  router.delete("/:id", isLogin, isAdmin, remove);
  router.patch("/rate/:id", isLogin, rate);
};
