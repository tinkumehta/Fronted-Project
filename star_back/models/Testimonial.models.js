import mongoose,{Schema} from "mongoose";

 const testimonialSchema = new Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        provider : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Provider"
        },
        message : String,
        createdAt : {
            type : Date,
            default : Date.now()
        }
    },
    {timestamps : true}
)

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);