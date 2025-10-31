import { ZodError } from "zod";
import Product from "../Models/ProductSchema.js";
import { productValidationSchema } from "../validations/product.js";
import dayjs from 'dayjs' 
dayjs().format()


export const createProduct = async (req, res) => {
  try {
    const body = { ...req.body };

    // if (req.file) {
    //   body.img = req.file.path || req.file.secure_url || req.file.url;
    // }
    console.log("",body)
    const parsed = productValidationSchema.parse(body);

    const newProduct = await Product.create(parsed);
    console.log("parsed",parsed)
    console.log("newProduuct",newProduct)
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    if (error.name === "ZodError") {
       let error = "";
      e.issues.forEach((el) => {
        error += `${el.path[0]}:${el.message}`;
      });
      console.log("error is",error);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    let { page, rows, name, category, fetchTotal,createdAt } = req.query;

    page = parseInt(page);
    rows = parseInt(rows);
    console.log(createdAt);
    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" };
    if(createdAt) {
        const start = dayjs(createdAt).startOf("day").toDate()
        const end = dayjs(createdAt).endOf("day").toDate()

        query.createdAt = { $gte: start, $lte: end };
    }

    const products = await Product.find(query, { __v: 0 })
      .skip(page * rows)
      .limit(rows)
      .lean();
    let total = 0;
    console.log(products.data, products);
    if (fetchTotal) {
      total = await Product.countDocuments(query);
    }
    // console.log(query);
    // console.log("products", products);
    return res.status(200).json({
      success: true,
      total,
      page,
      rows,
      count: products.length,
      data: products,
    });
  } catch (e) {
    console.log("error",e.error)
    return res.status(500).json({
      success: false,
      message: e.message || "Server error",
    });
  }
};
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id, { __v: 0 });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({ success: true, data: product });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const imageUpload = async (req, res) => {
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imgUrl = req.file.path;
    
    res
      .status(200)
      .json({ message: "Image uploaded successfully", url: imgUrl });
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = { ...req.body };
    console.log("heyeyhee", updates.img);
    console.log("updates", updates);
    console.log(req.file);
    // if (req.file) {
    //   updates.img = req.file.path || req.file.secure_url || req.file.url;
    // }

    const validated = productValidationSchema.partial().parse(updates);
    console.log("validated",validated)
    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: validated },
      { new: true, projection: { __v: 0 } }
    );
    console.log("after update",updated)
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (e) {
    if (e.name === "ZodError") {
      let error = "";
      e.issues.forEach((el) => {
        error += `${el.path[0]}:${el.message}`;
      });
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error,
      });
    }

    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
