import { Router } from "express";
import { helathcheck } from "../controllers/healthcheck.controllers.js";

const router = Router()


router.route("/").get(helathcheck)

export default router