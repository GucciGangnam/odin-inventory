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

    router.get("/categories/:id/delete", category_controller.category_delete_get)

    router.post("/categories/:id/delete", category_controller.category_delete_post)






/////// Display Spesific Catagory /// USING ID'S SO MUST COME LAST!!!!!!
router.get("/categories/:id", category_controller.category_detail)



////////////////PRODUCTS ///////////////////////////  

// NEW PRODUCT //
  /* Display New PRODUCT form */
  router.get("/products/new", product_controller.new_get)

  /* Display New PRODUCT form */
  router.post("/products/new", product_controller.new_post)
  //////////////////////


/* Display Products */
router.get("/products", product_controller.index)





/////// Display Spesific Products /// USING ID'S SO MUST COME LAST!!!!!!
router.get("/products/:id", product_controller.product_detail)


///// Upadte prodduct route//////

router.get("/products/:id/update", product_controller.update_get)
router.post("/products/:id/update", product_controller.update_post)

///DELETE PRODUCT///////

router.get("/products/:id/delete", product_controller.product_delete_get)

router.post("/products/:id/delete", product_controller.product_delete_post)



module.exports = router;
