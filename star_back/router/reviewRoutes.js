import {Router} from 'express'
import { 
    createReview,
     getReviewsByProvider } from '../controller/reviewController.js'
import {verifyToken} from "../middleware/authMiddleware.js"

 const router = Router();

 router.post('/', verifyToken, createReview);
 router.get('/:providerId', getReviewsByProvider)

  export default router;