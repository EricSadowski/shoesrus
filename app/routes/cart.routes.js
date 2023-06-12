module.exports = app => {
    const products = require("../controllers/products.controller.js");
    const cart = require("../controllers/cart.controller.js");
    
    var cartRouter = require("express").Router();
  
    //  // Get all products in the cart
    // cartRouter.get("/", cart.getCartItems); 
  
    // Add a product to the cart
    cartRouter.post("/", cart.submitOrder);
  
    app.use('/api/cart', cartRouter);

  };