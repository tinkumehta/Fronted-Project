import mongoose, {Schema} from "mongoose";

 const providerSchema = new Schema(
    {
        name : {
            type : String,
            required : true
        },
        category : {
            type : String,
            required : true
        },
        contact : {
            type : String,
            required : true
        },
        location : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        createdAt : {
            type : Date,
            default : Date.now()
        }
    }, 
    {timestamps : true}
)

export const Provider = mongoose.model("Provider", providerSchema)