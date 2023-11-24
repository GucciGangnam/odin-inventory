const Categories = require("../models/category");
const Products = require("../models/product");

// import async handler
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const numProducts = await Products.countDocuments({});
    // Calculate the total number of items in stock
    const totalItems = await Products.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$numberInStock" }
            }
        }
    ]);
    const numItems = totalItems.length > 0 ? totalItems[0].total : 0;
    const allCProducts = await Products.find({});
    res.render('products', {
        title: 'Odin Inventory Products',
        numProducts: numProducts,
        allCProducts: allCProducts,
        numItems: numItems,
    })
});