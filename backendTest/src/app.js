import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

const app = express()

app.use(
    cors({
        origin : process.env.CORS_ORIGIN,
        credentials : true
    })
)

app.use(express.json({limit : "25mb"}))
app.use(express.urlencoded({extended : true, limit : "16mb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(morgan("dev")) // HTTP request logger middleware for node.js


// import routes
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.router.js"

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/tweets", tweetRouter)


// http://localhost:8000/api/v1/users/register


export {app}