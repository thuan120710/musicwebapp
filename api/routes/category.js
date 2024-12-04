const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

// Route to fetch all categories
router.get("/categories", categoryController.getCategories);

// Route to create a new category
router.post("/category", categoryController.createCategory);

// Route to update a category by ID
router.put("/category/:id", categoryController.updateCategory);

// Route to delete a category by ID
router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;
