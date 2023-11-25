const { render } = require("../app");
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

// Display spesific product

exports.product_detail = asyncHandler(async (req, res, next) => {
    let productName = req.params.id.charAt(0).toUpperCase() + req.params.id.slice(1);


    try {
        const foundProduct = await Products.findOne({ name: productName });

        if (foundProduct) {
            res.render("productDetail", { product: foundProduct.name, description: foundProduct.description, price: foundProduct.price, category: foundProduct.category, stock: foundProduct.numberInStock});
        } else {
            res.render("productDetail", { product: productName + " not found." });
        }
    } catch (err) {
        // Handle any potential errors, e.g., log them or send an error response
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
