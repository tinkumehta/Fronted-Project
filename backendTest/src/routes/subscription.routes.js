import {Router} from "express"
import { 
    toggleSubscription ,
    getSubscribedChannels,
    getUserChannelSubscribers
} from "../controllers/subscription.controllers.js"

import{verifyJWT} from "../middlewares/auth.middlewares.js"


const router = Router();

router.use(verifyJWT);

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);


router.route("/u/:subscribedId").get(getSubscribedChannels)

export default router
