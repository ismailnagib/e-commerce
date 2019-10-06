const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    gSignIn: {
      type: Number,
      default: 0
    },
    isAdmin: {
      type: Number,
      default: 0
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    counts: {
      type: Array
    },
    total: {
      type: Array
    },
    totalsum: {
      type: Number,
      default: 0
    },
    transaction: [
      {
        cart: {
          counts: Array,
          items: [
            {
              type: Schema.Types.ObjectId,
              ref: "Product"
            }
          ],
          total: {
            type: Array
          },
          totalsum: {
            type: Number,
            default: 0
          },
          discount: {
            type: Number,
            default: 0
          }
        },
        date: {
          type: Date,
          required: true
        }
      }
    ],
    boughtProducts: Array
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
