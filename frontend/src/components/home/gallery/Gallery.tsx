import "./Gallery.scss";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Gallery = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    document.querySelectorAll(".photo-box").forEach((card, _) => {   
      gsap.to(card, {
        scale: 0.5,
        opacity: 0,
        scrollTrigger: {
          trigger: card,
          start: "top 50px",
          end: "bottom 150px",
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <div className="gallery-container">
      <div className="gallery-photos">
        <div className="photo-box">
          <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Gallery item 1" />
          <p>Clean your house with our professional maid service</p>
        </div>
        <div className="photo-box">
          <img src="https://images.unsplash.com/photo-1653276055789-26fdc328680f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Gallery item 2" />
          <p>Find a home tutor according to your needs</p>
        </div>
        <div className="photo-box">
          <img src="https://images.unsplash.com/photo-1657049199023-87fb439d47c5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Gallery item 3" />
          <p>Move your home with our experienced house movers</p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;