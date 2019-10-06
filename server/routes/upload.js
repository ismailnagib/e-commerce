"use strict";
const images = require("../helpers/images");
const { isLogin, isAdmin } = require("../middlewares/isAuth");
const { httpStatus } = require('../config/code');

module.exports = router => {
  router.post(
    "/",
    isLogin,
    isAdmin,
    images.multer.single("image"),
    images.sendUploadToGCS,
    (req, res) => {
      res.status(httpStatus.ok).json({
        status: 200,
        message: "Your file is successfully uploaded",
        link: req.file.cloudStoragePublicUrl
      });
    }
  );
};
