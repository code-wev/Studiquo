import { Router } from "express";
import { login, saveUser } from "../controller/UserController.js";

export const router = Router();


router.post('/', saveUser);
router.post('/login', login)

export default router;