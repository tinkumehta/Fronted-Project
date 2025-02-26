import mongoose from 'mongoose'
import { DB_NAME } from '../constant/index.js'

const connectDB = (async () => {
    try {
     const connectInstanceDB =   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
     console.log(`MONGODB Connection Sucessful ${connectInstanceDB.connection.host}`);
     
    } catch (error) {
        console.log("MONGODB Connection falied");
        process.exit(1)
    }
})

export default connectDB