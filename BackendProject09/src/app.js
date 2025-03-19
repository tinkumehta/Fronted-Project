import express from 'express'
import cors  from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from './routes/user.router.js'
import tweetRouter from "./routes/tweet.router.js"
import  helathcheckRouter  from './routes/healthcheck.router.js'
import likeRouter from "./routes/like.router.js"
import commentRouter from "./routes/comment.router.js"
import videoRouter from "./routes/video.router.js"
import dashboardRouter from "./routes/dashboard.router.js"


// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/healthcheck", helathcheckRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

export {
    app
}