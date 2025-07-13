import mongoose from "mongoose";
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
import authRouter from "./router/authRoutes.js"
import providerRouter from "./router/providerRoutes.js"
import testimonialRoutes from './router/testimonialRoutes.js'
import reviewsRoutes from "./router/reviewRoutes.js"


 app.use("/api/auth", authRouter);
 app.use("/api/providers", providerRouter);
 app.use("/api/testimonials", testimonialRoutes);
 app.use("/api/reviews", reviewsRoutes);

// http://localhost/8000/api/auth/register

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch((err) => console.log(err)
    )