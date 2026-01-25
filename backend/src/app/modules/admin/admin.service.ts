import { ProfessionalService } from "../professional-service/profservice.model";
import Rent from "../rent/rent.model";
import { TUser } from "../user/user.interface";
import User from "../user/user.model";

const adminLogin = async (payload: any) => {

    if (payload.email == process.env.ADMIN_EMAIL && payload.password == process.env.ADMIN_PASS) {
        return true;
    }

    else return false;
};

//--------Prof service crud----------//
const getAllProfServices = async() =>{
    return await ProfessionalService.find();
}

/* ---------------- USER CRUD ---------------- */

const getAllUsers = async () => {
    return await User.find();
};

const updateUserDetails = async (_id: string, payload: TUser) => {
  const result = await User.findByIdAndUpdate(_id, payload, { new: true });
  return result;
};

const deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
};

/* ---------------- RENT CRUD ---------------- */

const getAllRents = async () => {
    return await Rent.find().populate("user");
};

const deleteRent = async (id: string) => {
    return await Rent.findByIdAndDelete(id);
};

export const adminServices = {
    adminLogin,
    getAllProfServices,
    getAllUsers,
    updateUserDetails,
    deleteUser,
    getAllRents,
    deleteRent,
};
