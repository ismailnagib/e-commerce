const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    validUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
