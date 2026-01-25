import { useEffect, useRef, useState } from "react";
import {
  FaHome,
  FaRestroom,
  FaTools,
  FaChalkboardTeacher,
  FaBolt,
  FaLaptop,
  FaPaintBrush,
  FaTruck,
} from "react-icons/fa";
import "./Service.scss";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Service = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const { contextSafe } = useGSAP();
  const navigate = useNavigate();

  //---------------device check-----------
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // -------gsap animation------------
  const servicesAnimation = contextSafe(function () {
    gsap.set(headingRef.current, {
      x: -500,
      opacity: 0,
      scale: 0.6,
    });
    gsap.set(".service-card", {
      x: -500,
      y: -50,
      opacity: 0,
      scale: 0.4,
      rotation: -3,
    });

    let tl;
    // ---------for mobile----------
    if (isMobile) {
      tl = gsap.timeline();

      tl.to(headingRef.current, {
        x: 0,
        duration: 1.5,
      }).to(
        ".service-card",
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 0.8,
          rotation: -3,
          duration: 1,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        "-=1"
      );

      setIsVisible(true);
    } else {
      //---------desktop--------
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          onEnter: () => setIsVisible(true),
          onLeave: () => setIsVisible(false),
        },
      });

      tl.to(headingRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 2,
      }).to(
        ".service-card",
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "back.out(1.7)",
        },
        "-=1.5"
      );
    }

    return tl;
  });

  useEffect(() => {
    servicesAnimation();
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile]);

  // -------------------------//

  const handleServiceClick = (link: string) => {
    navigate(`/main/${link}`);
  };

  const serviceList = [
    { id: 1, link: "rent", name: "Home / Room Rent", icon: <FaHome /> },
    {
      id: 2,
      link: "find-service/Maid",
      name: "Home Maid",
      icon: <FaRestroom />,
    },
    {
      id: 3,
      link: "find-service/Home Shifter",
      name: "Home Shifter",
      icon: <FaTruck />,
    },
    { id: 4, link: "find-service/Plumber", name: "Plumber", icon: <FaTools /> },
    {
      id: 5,
      link: "find-service/Tutor",
      name: "Home Tutor",
      icon: <FaChalkboardTeacher />,
    },
    {
      id: 6,
      link: "find-service/Electrician",
      name: "Electrician",
      icon: <FaBolt />,
    },
    {
      id: 7,
      link: "find-service/IT Provider",
      name: "IT Provider",
      icon: <FaLaptop />,
    },
    {
      id: 8,
      link: "find-service/Painter",
      name: "Painter",
      icon: <FaPaintBrush />,
    },
  ];

  return (
    <div className="service-container" ref={containerRef}>
      <div className={`service-header`} ref={headingRef}>
        <h3>Find what you need in person.</h3>
      </div>
      <div className="service-list">
        <ul>
          {serviceList.map((service, index) => (
            <li
              onClick={() => handleServiceClick(service.link)}
              className={`flex flex-col-reverse service-card ${
                isVisible ? "animate" : ""
              }`}
              key={service.id}
              style={{ animationDelay: isVisible ? `${index * 0.15}s` : "0s" }}
            >
              {service.icon}
              <span className="service-name">{service.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Service;
