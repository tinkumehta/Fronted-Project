import {Router} from 'express'
import {
    register,
    loginUser,

} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middlewares.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    register
)

router.route("/login").post(loginUser)


export default router