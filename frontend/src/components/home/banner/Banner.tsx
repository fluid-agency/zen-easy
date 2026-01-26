import { Link } from "react-router-dom";
import Header from "../../header/Header";
import "./Banner.scss";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const Banner = () => {
  const { contextSafe } = useGSAP();
  const bannerHeadingRef = useRef(null);
  const bannerContentRef = useRef(null);
  const bannerCtaRef = useRef(null);
  const bannerRef = useRef(null);
  

  useEffect(() => {
    bannerAnimations();
  }, []);

  const bannerAnimations = contextSafe(function () {
      gsap.fromTo(
      bannerRef.current,
      { 
        backgroundSize: "130%" 
      },
      { 
        backgroundSize: "100%", 
        duration: 3, 
        ease: "power2.out" 
      }
    );
    gsap.fromTo(
      bannerHeadingRef.current,
      { y: 600, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    );
    gsap.fromTo(
      bannerContentRef.current,
      { y: 600, opacity: 0 },
      { y: 0, opacity: 1, duration:0.8, delay:0.25 }
    );
    gsap.fromTo(
      bannerCtaRef.current,
      { y:650,  opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.25 }
    );
    
  });


  return (
    <div className="banner" ref={bannerRef}>
      <div className="banner-top-heade">
        <Header bg="black" />
      </div>
      <div className="banner-content-wrapper">
        <div className="banner-content">
          <h2 ref={bannerHeadingRef}>
            Making Home Service Seamless and Living Easy
          </h2>
          <p ref={bannerContentRef}>
            All of our service providers are highly vetted and certified to
            ensure that you receive top-quality work every time. From plumbers
            to IT provider's, each professional is selected based on their
            expertise and experience. 24/7 no matter the time, find your needed
            service provider with ease.
          </p>
        </div>
        <div ref={bannerCtaRef} className="banner-action-wrapper">
          <Link to="/main/add-rent" className="button btn-primary">
            Post Rent Ad
          </Link>
          <Link to="/main/offer-service" className="button btn-primary">
            Offer Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;