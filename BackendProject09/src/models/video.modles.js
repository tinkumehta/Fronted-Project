import mongoose, {Schema} from 'mongoose'
import mongooseAggregatePainate  from 'mongoose-aggregate-paginate-v2'

const videoSchmea = new Schema(
    {
        videoFile : {
            type : String, // cloudinary url
            required : true
        },
        thumbnail : {
            type : String, // cloudinary url
            required : true
        },
        title : {
            type : String, // cloudinary url
            required : true
        },
        description : {
            type : String, // cloudinary url
            required : true
        },
        duration : {
            type : Number,
            required : true,
        },
        views : {
            type : Number,
            default : 0,
        },
        isPublished : {
            type : Boolean,
            default : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },

    },
    {timestamps : true})

    videoSchmea.plugin(mongooseAggregatePainate)

export const Video = mongoose.model('Video', videoSchmea)