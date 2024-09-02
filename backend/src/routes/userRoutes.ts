import { Router } from "express";
import { login, logout, protect, signup,updatePassword,restrictTo } from "../controllers/authController";
import {getAllUsers,getMe,getOne,updateMe} from "../controllers/userController"
const router = Router();
console.log("t");
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",protect,logout)
router.patch("/updateMe",protect,updateMe);
router.patch("/updateMyPassword",protect,updatePassword);
router.get('/me', protect,getMe);
router.get('/',protect,restrictTo('admin'), getAllUsers);
export default router;
