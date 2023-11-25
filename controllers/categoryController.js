// import schemes 
const Categories = require("../models/category");
const Products = require("../models/product")

//Validator methods
const { body, validationResult } = require("express-validator");

// import async handler
const asyncHandler = require("express-async-handler");


//index//
exports.index = asyncHandler(async (req, res, next) => {
    const numCategories = await Categories.countDocuments({}).exec();
    const allCategories = await Categories.find({});
    res.render('categories', {
        title: 'Odin Inventory Categories',
        numCategories: numCategories,
        allCategories: allCategories
    })
});

//Display new form
exports.new_get = function (req, res, next) {
    res.render("newCategoryForm")
}
// Handle new form submissions
exports.new_post = [
    // Validate and sanitize fields.
    body("categoryName")
        .trim()
        .isLength({ min: 1 })
        .withMessage("must be at least 100 chars long")
        .customSanitizer(value => {
            // Capitalize the first letter
            return value.charAt(0).toUpperCase() + value.slice(1);
        }),
    body("categoryDescription")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Must have a description")
        .customSanitizer(value => {
            // Capitalize the first letter
            return value.charAt(0).toUpperCase() + value.slice(1);
        }),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create new category 

        const URL = req.body.categoryName.toLowerCase();
        const newCategory = new Categories({
            name: req.body.categoryName,
            description: req.body.categoryDescription,
            url: "categories/" + URL
        });

        if (!errors.isEmpty()) {
            res.render("newCategoryForm", { errors: errors.array() });
            console.log(errors);
            return;
        } else {
            //data is valid

            //Save Data 
            await newCategory.save();
            //Re-direct back to categories page
            res.redirect("/categories")
        }
    }),
];

// Display Specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
    const categoryId = req.params.id.charAt(0).toUpperCase() + req.params.id.slice(1);
    console.log(categoryId)

    const productsInCategory = await Products.find({ category: categoryId });
    const productsInCategoryCount = productsInCategory.length;

    res.render("categoryDetail", {categoryId : categoryId, productsInCategory: productsInCategory, productsInCategoryCount: productsInCategoryCount });
});

