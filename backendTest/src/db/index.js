import {DB_NAME} from "../constants.js"
import mongoose from 'mongoose'


const connectDB = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection Failed", error);
        
    }
}

export default connectDB