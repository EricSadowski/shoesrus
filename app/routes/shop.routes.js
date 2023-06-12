module.exports = app => {
    const shop = require("../controllers/shop.controller.js");
  
    var router = require("express").Router();
  
    // Create a new document
    router.post("/", shop.create);
  
    // Retrieve a single document with id
    router.get("/:product_id([0-9]+)", shop.findOne);
  
    // Retrieve all docs
    router.get("/", shop.findAll);

    app.use('/api/shop', router);
  };