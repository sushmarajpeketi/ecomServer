import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    price: {
      type: String,
      required: [true, "Product price is required"],
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
    },

    image: {
      type:String,
      default:""
      // url: { type: String, default: "" },
      // public_id: { type: String, default: "" },
    },

  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
