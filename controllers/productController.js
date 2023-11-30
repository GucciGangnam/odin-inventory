const { render, set } = require("../app");
const Categories = require("../models/category");
const Products = require("../models/product");

//Validator methods
const { body, validationResult } = require("express-validator");

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
    const allCProducts = await Products.find({})
        .sort({ name: 1 })
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
            res.render("productDetail", { product: foundProduct.name, description: foundProduct.description, price: foundProduct.price, category: foundProduct.category, stock: foundProduct.numberInStock });
        } else {
            res.render("productDetail", { product: productName + " not found." });
        }
    } catch (err) {
        // Handle any potential errors, e.g., log them or send an error response
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


// CREAT NEW PRODUCT FORM //
//Get//
exports.new_get = asyncHandler(async (req, res, next) => {
    // Generate array of all available catagories ///
    const availableCategories = await Categories.find({}, "name")
    const categoryNames = availableCategories.map(category => category.name);

    console.log(categoryNames)
    res.render("newProductForm", { categoryNames: categoryNames })
}),
    //Post//
    // Handle new form submissions
    exports.new_post = [
        // Validate and sanitize fields.
        body("productName")
            .trim()
            .isLength({ min: 1 })
            .withMessage("must be at least 1 char long")
            .customSanitizer(value => {
                // Capitalize the first letter
                return value.charAt(0).toUpperCase() + value.slice(1);
            })
            .customSanitizer(value => { 
                return value.replace(/\s+/g, '&');
            }),
        body("productDescription")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Must have a description"),
        body("productCategory")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Must have a description")
            .customSanitizer(value => {
                // Capitalize the first letter
                return value.charAt(0).toUpperCase() + value.slice(1);
            }),
        body("numberInStock")
            .isLength({ min: 1 })
            .withMessage("Stock count must be a number")
            .isNumeric(),
        body("price")
            .trim()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage("Price must be a number"),


        // Process request after validation and sanitization.
        asyncHandler(async (req, res, next) => {
            // Extract the validation errors from a request.
            const errors = validationResult(req);

            const URL = req.body.productName.toLowerCase();
            const newProduct = new Products({
                name: req.body.productName,
                description: req.body.productDescription,
                category: req.body.productCategory,
                price: req.body.price,
                numberInStock: req.body.numberInStock,
                url: "/products/" + URL
            });

            if (!errors.isEmpty()) {
                const availableCategories = await Categories.find({}, "name")
                const categoryNames = availableCategories.map(category => category.name);

                res.render("newProductForm", { errors: errors.array(), categoryNames: categoryNames });
                console.log(errors);
                return;
            } else {
                //data is valid

                //Save Data 
                await newProduct.save();
                console.log("new product added")
                //Re-direct back to categories page
                res.redirect("/")
            }
        }),
    ];

//////////// Update product ////////

exports.update_get = asyncHandler(async (req, res, next) => {
    const productToUpdate = await Products.findOne({ name: req.params.id })
    console.log(productToUpdate)
    const availableCategories = await Categories.find({}, "name")
    const categoryNames = availableCategories.map(category => category.name);

    res.render("productUpdate", { productName: productToUpdate.name, description: productToUpdate.description, price: productToUpdate.price, category: productToUpdate.category, stock: productToUpdate.numberInStock, categoryNames: categoryNames })
})

exports.update_post =
    //     res.send("hello")
    // }
    [
        // Validate and sanitize inputs 
        body("productName")
            .optional()
            .trim()
            .isLength({ min: 1 })
            .withMessage("Name must be at least 1 char")
            .customSanitizer(value => {
                // Capitalize the first letter
                return value.charAt(0).toUpperCase() + value.slice(1);
            }),
        body("productDescription")
            .optional()
            .trim()
            .isLength({ min: 1 })
            .withMessage("Description must be at least 1 char")
            .customSanitizer(value => {
                // Capitalize the first letter
                return value.charAt(0).toUpperCase() + value.slice(1);
            }),
        body("productCategory")
            .optional()
            .trim()
            .customSanitizer(value => {
                // Capitalize the first letter
                return value.charAt(0).toUpperCase() + value.slice(1);
            }),
        body("productPrice")
            .optional()
            .trim()
            .isLength({ min: 1 })
            .withMessage("Price must be at least 1 char")
            .isNumeric()
            .withMessage("Price Must be a number"),

        body("stockCount")
            .optional()
            .isNumeric()
            .withMessage("Stock count must be a number")
            .isLength({ min: 1 })
            .withMessage("Price must be at least 1 char"),


        // Process request after validation and sanitization.
        asyncHandler(async (req, res, next) => {
            // get the poriginal product 
            const originalproduct = await Products.findOne({ name: req.params.id })
            // res.json(originalproduct)
            // Pass down info of original product forerror handling on render screen 
            const productName = originalproduct.name
            const productDescription = originalproduct.description
            const productCategory = originalproduct.category
            const productPrice = originalproduct.price
            const stockCount = originalproduct.numberInStock

            // Extract the validation errors from a request.
            const errors = validationResult(req);
            // const URL = req.body.productName.toLowerCase();

            if (!errors.isEmpty()) {
                const availableCategories = await Categories.find({}, "name")
                const categoryNames = availableCategories.map(category => category.name);

                res.render("productUpdate", {
                    errors: errors.array(),
                    categoryNames: categoryNames,
                    productName: productName,
                    description: productDescription,
                    category: productCategory,
                    price: productPrice,
                    stock: stockCount
                });
                console.log("error being rendered on screen now");
                return;
            } else {
                //data is valid
                console.log("data is valid")
                // Create object for updated product 
                const updatedProduct = {
                    name: req.body.productName,
                    description: req.body.productDescription,
                    category: req.body.productCategory,
                    numberInStock: req.body.stockCount,
                    price: req.body.productPrice
                }
                    await originalproduct.updateOne(
                        { $set: 
                            { name: updatedProduct.name, url: `/products/${updatedProduct.name }`, description: updatedProduct.description, category: updatedProduct.category, price: updatedProduct.price, numberInStock: updatedProduct.numberInStock},
                        }                   
                    )
                    res.json([originalproduct, updatedProduct])
                }
            }),
    ]

// Delete product //////////////////////////////////////////////////////////////
exports.product_delete_get = asyncHandler(async (req, res, next) => {
    const product = req.params.id
    // Check if product exsists 
    const foundProduct = await Products.findOne({ name: product });
    if (foundProduct !== null) {
        res.render("productDelete", { product: product })
    } else {
        res.send("This link doesn't exist")
    }
})

exports.product_delete_post = async function (req, res, next) {
    const productName = req.params.id;

    try {
        // Use Mongoose to find and delete the product by its ID
        const deletedProduct = await Products.findOneAndDelete({ name: productName });
        console.log(deletedProduct)
        if (!deletedProduct) {
            // Product not found
            return res.status(404).send('Product not found');
        }

        // Redirect to the products page after successful deletion
        res.redirect("/products");
    } catch (err) {
        // Handle errors, e.g., log them or send an error response
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

