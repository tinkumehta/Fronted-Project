import express from 'express'
import { Router } from 'express'
import {register, login} from '../controller/authController.js'

const router = Router();

router.post("/register", register)
router.post("/login", login);

export default router