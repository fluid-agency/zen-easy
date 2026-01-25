import './Footer.scss';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about-us">
          <h3 className="footer-logo">Zen Easy</h3>
          <p>Your one-stop solution for home services and rentals. Connecting you with trusted professionals and properties with ease.</p>
        </div>

        <div className="footer-section services">
          <h3>Our Services</h3>
          <ul>
            <li><Link to="/services/rent">Rent</Link></li>
            <li><Link to="/services/home-moving">Home Moving</Link></li>
            <li><Link to="/services/home-maid">Home Maid</Link></li>
            <li><Link to="/services/home-shifter">Home Shifter</Link></li>
            <li><Link to="/services/tutor">Tutor</Link></li>
            <li><Link to="/services/it-provider">IT Provider</Link></li>
            <li><Link to="/services/plumber">Plumber</Link></li>
            <li><Link to="/services/electrician">Electrician</Link></li>
          </ul>
        </div>

        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-section follow-us">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} <span className="brand-name">Zen Easy</span>. All rights reserved.</p>
        <p>Created by <span className="brand-name">aiarnob23@gmail.com</span></p>
      </div>
    </footer>
  );
};

export default Footer;
