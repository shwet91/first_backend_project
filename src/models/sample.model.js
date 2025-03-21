import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const sampleSchema = new Schema(
    {
        // content: {
        //     type: String, //cloudinary url
        //   //  required: true
        // },
        // video: {
        //     type: Schema.Types.ObjectId,
        //     ref: "Video"
        // },
        // owner:{
        //     type: Schema.Types.ObjectId,
        //     ref: "User"
        // }



        name: { type: String, required: true },
        size: { type: String, required: true, enum: ["small", "medium", "large"] },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        date: { type: Date, required: true }



    },
    {timestamps: true}
)

sampleSchema.plugin(mongooseAggregatePaginate)
export const SampleDB = mongoose.model("SampleDB", sampleSchema)