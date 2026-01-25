import { serverBaseUrl } from "../utils/baseUrl";

// get rent posts
export const getRentPosts = async () => {
  try {
    const response = await serverBaseUrl.get(`rent/rent-posts`, {
    //   headers: {
    //     Authorization: `${token}`,
    //   },
    });
    const result = response?.data;
    return result;
  } catch (error) {
    console.error("Failed to fetch rent posts", error);
    return null;
  }
};


//view rent post's details
export const getRentDetails = async(id : string)=>{
  try{
    const response = await serverBaseUrl.get(`/rent/view-details/${id}`)
    const result = response?.data;
    return result;
  }catch(error){
    console.error("Failed to fetch the rent details");
    return null;
  }
}

//delete a rent post
export const deleteRentPost = async(id:string)=>{
  try{
    console.log("request going......");
    const response = await serverBaseUrl.delete(`/rent/delete/${id}`)
    const result = response?.data;
    return result;
  }catch(error){
    console.log("Failed to delete rent post");
    return null;
  }
}