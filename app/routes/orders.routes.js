module.exports = app => {
    const orders = require("../controllers/orders.controller.js");
  
    var router = require("express").Router();

    
    // to get all..?
    // router.get("/", orders.findAll);
  
    // GET all the orders from a particular user
    router.get("/:user_id([0-9]+)", orders.findAllByUser);
  
    // // MAYBE TO CHANGE QUANTITY
    // router.put("/:id([0-9]+)", todos.update);
  

    app.use('/api/orders', router);
  };