const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const userModel = require("../models/user.model");


//  Generate Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "7d" }
    );
};


//  REGISTER USER
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.createUser({
        name,
        email,
        password: hashedPassword,
        role: role || "user"
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully"
    });
});


//  LOGIN USER
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Email and password required", 400));
    }

    const users = await userModel.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return next(new ErrorHandler("Invalid email", 401));
    }

    //  CHECK STATUS (IMPORTANT 🔥)
    if (user.status === "blocked") {
        return next(new ErrorHandler("Your account is blocked", 403));
    }

    if (user.status === "inactive") {
        return next(new ErrorHandler("Your account is inactive", 403));
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(new ErrorHandler("Invalid password", 401));
    }

    const token = generateToken(user);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});
// GET ALL USERS
exports.getUsers = catchAsyncError(async (req, res) => {
    const users = await userModel.getAllUsers();

    res.json({
        success: true,
        users
    });
});


//  GET SINGLE USER
exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await userModel.getUserById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.json({
        success: true,
        user
    });
});


//  UPDATE USER
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const { role, status } = req.body;

    await userModel.updateUser(req.params.id, { role, status });

    res.json({
        success: true,
        message: "User updated"
    });
});


//  DELETE USER
exports.deleteUser = catchAsyncError(async (req, res) => {
    await userModel.deleteUser(req.params.id);

    res.json({
        success: true,
        message: "User deleted"
    });
});