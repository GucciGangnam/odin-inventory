var express = require('express');
var router = express.Router();

//Require controller modules 
const home_controller = require("../controllers/homeController")
const category_controller = require("../controllers/categoryController")
const product_controller = require("../controllers/productController")

/* Dispaly home page. */
router.get('/', home_controller.index);

/* Display Categories */
router.get("/categories", category_controller.index)


  // NEW CATEGORY //
  /* Display New catagory form */
  router.get("/categories/new", category_controller.new_get)

  /* Display New catagory form */
  router.post("/categories/new", category_controller.new_post)
  //////////////////////

    // DELETE CATEGORY //








/////// Display Spesific Catagory /// USING ID'S SO MUST COME LAST!!!!!!
router.get("/categories/:id", category_controller.category_detail)



////////////////PRODUCTS ///////////////////////////  


/* Display Products */
router.get("/products", product_controller.index)





/////// Display Spesific Products /// USING ID'S SO MUST COME LAST!!!!!!
router.get("/products/:id", product_controller.product_detail)

module.exports = router;
