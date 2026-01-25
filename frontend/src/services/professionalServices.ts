import { serverBaseUrl } from "../utils/baseUrl"

//get the user's total service count
export const getUsersProfessionalInfo = async(id:string) => {
    const response = await serverBaseUrl.get(`/user/professional-details/${id}`);
    return response?.data?.data;
}

//find services
export const findServicesByCategory = async(category:string)=>{
    const response = await serverBaseUrl.get(`/profession/find-services/${category}`);
    return response?.data;
}

//find a service details
export const findServiceDetailsById = async(id:string)=>{
    const response = await serverBaseUrl.get(`/profession/view-details/${id}`)
    return response?.data;
}

//post feedback
export const addNewFeedback = async(payload : any)=>{
    const {serviceId, ...restPayload} = payload;
    const res = await serverBaseUrl.post(`/profession/add-feedback/${serviceId}`, restPayload);
    console.log(res);
    return res?.data;
}