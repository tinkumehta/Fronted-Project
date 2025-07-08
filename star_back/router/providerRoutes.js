import {Router} from 'express'
import {
    createProvider, 
    getAllProviders, 
    searchProviders
} from "../controller/providerController.js"

 
const router = Router();

router.post('/', createProvider);
router.get('/', getAllProviders);
router.get('/search', searchProviders)

export default router;