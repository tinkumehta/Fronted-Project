import {Router} from 'express'
import {
    register,
    loginUser,
    refreshAccessToken,
    changePassword,
    logout,
    getCurrentUser,
    updateAccountDetails,
    updateCoverImage,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory,
    followUser,
    getFollowersFollowing,
    unfollowUser,
    searchUser,
    suggestionUser
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
router.route("/refresh-token").post(refreshAccessToken)

// secure routes
router.route("/logout").post(verifyJWT, logout)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

router.route("/follow/:id").post(verifyJWT, followUser);
router.route("/unfollow/:id").post(verifyJWT, unfollowUser);
router.route("/follows/:id").get(getFollowersFollowing);

router.route("/search").get(verifyJWT, searchUser);
router.route("/suggestions").get(verifyJWT, suggestionUser);

export default router