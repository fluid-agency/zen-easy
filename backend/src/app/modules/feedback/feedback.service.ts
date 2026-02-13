import { TFeedback } from "./feedback.interface";
import Feedback from "./feedback.model";


//get all feedback
const getAllFeedback = async () => {
    const feedbacks = await Feedback.find().populate('user', 'name profileImage occupation');
    return feedbacks;
}

//create feedback
const createFeedback = async (payload: TFeedback) => {
    const result = await Feedback.create(payload);
    return result;
}


export const feedbackServices = {
    getAllFeedback,
    createFeedback
};
