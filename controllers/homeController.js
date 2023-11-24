// import schemes 
const Categories = require("../models/category");
const Products = require("../models/product");

// import async handler
const asyncHandler = require("express-async-handler");

// Get number of categories and number of products and pass through to render home.ejs
exports.index = asyncHandler(async (req, res, next) => {
    const numCategories = await Categories.countDocuments({}).exec();
    const numProducts = await Products.countDocuments({}).exec();
    res.render('home', {
        title: 'Odin Inventory',
        numCategories: numCategories,
        numProducts: numProducts,
    })
});
