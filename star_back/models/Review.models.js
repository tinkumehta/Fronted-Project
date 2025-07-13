import mongoose,{Schema} from "mongoose";

 const reviewsSchema = new Schema (
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        provider : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Provider"
        },
        rating : {
            type : Number,
            min : 1,
            max : 5
        },
        comment : String,
        createdAt : {
            type : Date,
            default : Date.now()
        }
    },
    {timestamps : true}
 )

  export const Reviews = mongoose.model('Reviews', reviewsSchema)