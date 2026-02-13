import { model, Schema } from "mongoose";
import { TFeedback } from "./feedback.interface";

const FeedbackSchema: Schema = new Schema<TFeedback>(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            trim: true,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Feedback = model<TFeedback>("Feedback", FeedbackSchema);
export default Feedback;
