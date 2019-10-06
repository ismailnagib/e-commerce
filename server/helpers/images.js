"use strict";
require("dotenv").config();
const { httpStatus } = require('../config/code');

const { Storage } = require("@google-cloud/storage");

const CLOUD_BUCKET = process.env.UPLOAD_GC_BUCKET;

const storage = new Storage({
  projectId: process.env.UPLOAD_GC_PROJECT,
  keyFilename: process.env.UPLOAD_GC_KEYFILE_PATH
});

const bucket = storage.bucket(CLOUD_BUCKET);

const getPublicUrl = filename => {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
};

const sendUploadToGCS = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const gcsname = Date.now() + req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on("error", err => {
    req.file.cloudStorageError = err;
    return res.status(httpStatus.badRequest).json({ message: err.message || err });
  });

  stream.on("finish", () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
      next();
    });
  });

  stream.end(req.file.buffer);
};

const Multer = require("multer"),
  multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
      fileSize: 1 * 1024 * 1024
    }
  });

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  multer
};
