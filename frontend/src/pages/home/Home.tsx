import Banner from "../../components/home/banner/Banner";
import WebFeedback from "../../components/home/feedback/webFeedback";
import Gallery from "../../components/home/gallery/Gallery";
import { PricingBasic } from "../../components/home/membership/membership";
import OurProperty from "../../components/home/membership/our-property/OurProperty";
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
      <PricingBasic/>
      </div>
      <div>
        <OurProperty/>
      </div>
      <div>
        <WebFeedback/>
      </div>
    </div>
  );
};

export default Home;
