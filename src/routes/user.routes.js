const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

// MIDDLEWARE
const { isAuth } = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

// AUTH
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

//  USERS (ONLY ADMIN)
router.get("/users", isAuth, authorizeRoles("admin"), userController.getUsers);

router.get("/users/:id", isAuth, authorizeRoles("admin"), userController.getUser);

//  UPDATE (ONLY ADMIN)
router.put("/users/:id", isAuth, authorizeRoles("admin"), userController.updateUser);

module.exports = router;