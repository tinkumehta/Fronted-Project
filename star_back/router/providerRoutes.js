import {Router} from 'express'
import {
    createProvider, 
    getAllProviders, 
    searchProviders
} from "../controller/providerController.js"
import {verifyToken} from '../middleware/authMiddleware.js'

 
const router = Router();

router.post('/',verifyToken, createProvider);
router.get('/', getAllProviders);
router.get('/search', searchProviders)

export default router;