import { Router } from "express";
import {
    healthcheck
}from "../controllers/healthcheck.controllers.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT)

router.route("/").post(healthcheck)


export default router;