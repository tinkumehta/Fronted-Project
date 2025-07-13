import {Router} from "express"
import {
    createTestimonial, getTestimonials
} from "../controller/testimonialController.js"
import {verifyToken} from "../middleware/authMiddleware.js"

 const router = Router();

 router.post('/', verifyToken, createTestimonial);
 router.get('/', getTestimonials)

  export default router