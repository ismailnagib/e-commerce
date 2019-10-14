const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { httpStatus } = require('../config/code');

mongoose.set('useCreateIndex', true);

const isDuplicate = async (name) => {
  try {
    const duplicate = await Category.findOne({ name });
    return !isEmpty(duplicate);
  } catch (error) {
    return true
  }
}

module.exports = {
  show: async (req, res) => {
    try {
      const data = await Category.find({});
      return res.status(httpStatus.ok).json(data);
    } catch (error) {
      return res.status(httpStatus.internalServerError).json({ error });
    }
  },

  add: async (req, res) => {
    try {
      const { name, icon } = req.body;

      if (!name || !icon) return res.status(httpStatus.badRequest).json({ message: 'Parameter name and icon is required.' });
      if (await isDuplicate(name)) return res.status(httpStatus.badRequest).json({ message: 'There has been a category with the same name.' });

      const data = await Category.create({ name, icon });
      return res.status(httpStatus.ok).json(data);
    } catch (error) {
      return res.status(httpStatus.internalServerError).json({ error });
    }
  },

  edit: async (req, res) => {
    try {
      const { id: _id } = req.params;
      const { name, icon } = req.body;

      if (await isDuplicate(name)) return res.status(httpStatus.badRequest).json({ message: 'There has been a category with the same name.' });

      const data = await Category.updateOne({ _id }, { name, icon });
      return res.status(httpStatus.ok).json(data);
    } catch (error) {
      return res.status(httpStatus.internalServerError).json({ error });
    }
  },

  remove: async (req, res) => {
    let session = null;

    try {
      const { id: _id } = req.params;

      session = await mongoose.startSession();

      session.startTransaction();

      const category = await Category.deleteOne({ _id }).session(session);
      const product = await Product.deleteMany({ category: _id }).session(session);

      session.commitTransaction();

      return res.status(httpStatus.ok).json({ category, product });
    } catch (error) {
      if (session) session.abortTransaction();
      return res.status(httpStatus.internalServerError).json({ error });
    }
  }
};
