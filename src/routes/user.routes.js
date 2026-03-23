const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

// AUTH
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// USERS
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUser);

//update
router.put("/users/:id", userController.updateUser);


module.exports = router;