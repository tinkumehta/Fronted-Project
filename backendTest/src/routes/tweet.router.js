import {Router} from "express"
import {
    createTweet,
    updateTweet, 
    deleteTweet,
    getUserTweets,
    getAllTweets
} from "../controllers/tweet.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js";


  const router =  Router();

  router.use(verifyJWT, upload.none());

  router.route("/").post(createTweet);
  router.route("/:tweetId").patch(updateTweet).delete(deleteTweet)
  router.route("/user/:userId").get(getUserTweets);
  router.route("/all").get(getAllTweets)


  export default router;