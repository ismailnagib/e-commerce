const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 20
    },
    description: {
      type: String,
      required: true,
      maxlength: 72
    },
    backtext: {
      type: String,
      required: true,
      maxlength: 4
    },
    price: {
      type: Number,
      required: true,
      max: 9999999999
    },
    image: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 0,
      max: 5,
      min: 0
    },
    ratedBy: Array,
    ratings: [
      {
        type: Number,
        max: 5,
        min: 0
      }
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
