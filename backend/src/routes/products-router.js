const express = require("express");
const { createProduct } = require("./../use-cases/createProduct");
const { showProducts } = require("./../use-cases/showProducts");
const { findProductDetails } = require("./../use-cases/findProductById");
const { deleteProduct } = require("./../use-cases/deleteProduct");
const multer = require("multer");

const productsRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    cb(null, "uploads");
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const uploadMiddleware = multer({ storage }).single("image");

productsRouter.post("/addnewProduct", uploadMiddleware, (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: "Please include a item." });
    return;
  }

  const newItem = {
    title: req.body.title,
    description: req.body.description,
    price: "$" + req.body.price,
    // HIER MUSS DER PATH, aber wie??????
    filename: req.file.filename,
  };

  console.log(newItem);

  createProduct(newItem)
    .then((addedItem) => res.status(201).json(addedItem))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to add item to database." });
    });
});

productsRouter.get("/allproducts/:id", (req, res) => {
  const productId = req.params.id;
  findProductDetails(productId)
    .then((products) => res.json(products))
    .catch((err) => {
      res.status(500).json({ error: "Failed to load products from database." });
    });
});

productsRouter.get("/allproducts", (_, res) => {
  showProducts()
    .then((products) => res.json(products))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to load products from database." });
    });
});

productsRouter.delete("/deletedProduct/:id", (req, res) => {
  const productId = req.params.id;
  deleteProduct(productId)
    .then((products) => res.json(products))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to delete product" });
    });
});

module.exports = { productsRouter };
