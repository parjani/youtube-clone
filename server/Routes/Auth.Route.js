import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../Controllers/Auth.Controller.js";

import authMiddleware from "../Middleware/AuthMiddleware.js";

const router = express.Router();


// Register User
router.post("/register", registerUser);


// Login User
router.post("/login", loginUser);


// Get Logged In User
router.get("/me", authMiddleware, getCurrentUser);


export default router;