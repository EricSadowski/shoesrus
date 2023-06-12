module.exports = app => {
  const users = require("../controllers/users.controller.js");
  

  var router = require("express").Router();

  // Create a new user
  router.post("/", users.create);

  // Validate authentication, similar to /:id
  router.get('/me', users.findMe);

  // find a user by their username
  router.get("/:username", users.findOne);
  

  // Update user's own profile
  // router.put("/me", users.updateMe);

  app.use('/api/users', router);
};