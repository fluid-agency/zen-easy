import Banner from "../../components/home/banner/Banner";
import Feedback from "../../components/home/feedback/Feedback";
import Gallery from "../../components/home/gallery/Gallery";
import OurProperty from "../../components/home/our-property/OurProperty";
import Service from "../../components/home/service/Service";

const Home = () => {
  return (
    <div className="w-full">
      <div>
        <Banner />
      </div>
      <div>
        <Service/>
      </div>
      <div>
        <Gallery/>
      </div>
      <div>
        <OurProperty/>
      </div>
      <div>
        <Feedback/>
      </div>
    </div>
  );
};

export default Home;
