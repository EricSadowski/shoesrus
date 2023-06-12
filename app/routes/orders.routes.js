module.exports = app => {
    const orders = require("../controllers/orders.controller.js");
  
    var router = require("express").Router();
  
    // // Create a new Todos
    // router.post("/", todos.create);
  
    // to get all..?
    // router.get("/", orders.findAll);
  
    // GET A SPECIFIC ORDER
    router.get("/:user_id([0-9]+)", orders.findOne);
  
    // // MAYBE TO CHANGE QUANTITY
    // router.put("/:id([0-9]+)", todos.update);
  
    // Delete an item TODO
    // router.delete("/:id([0-9]+)", todos.delete);
  
    app.use('/api/orders', router);
  };