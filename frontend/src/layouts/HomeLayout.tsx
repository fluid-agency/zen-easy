import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";


const HomeLayout = () => {
  return (
    <div className="mt-[70px]">
        <Outlet/>
        <Footer/>
    </div>
  );
};

export default HomeLayout;