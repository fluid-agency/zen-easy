import { useState, useEffect } from 'react';
import { User, Menu, X, Home, Wrench, Users, Zap, Code, Palette, Car } from 'lucide-react';
import Cookies from 'js-cookie';

const Header = ({ bg = "white" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const selfId = Cookies.get("zenEasySelfId");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);


  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: "Rent", path: "/main/rent", icon: Home },
    { name: "Maid", path: "/main/find-service/Maid", icon: Users },
    { name: "Home Shifter", path: "/main/find-service/Home Shifter", icon: Car },
    { name: "Plumber", path: "/main/find-service/Plumber", icon: Wrench },
    { name: "Tutor", path: "/main/find-service/Tutor", icon: Users },
    { name: "Electrician", path: "/main/find-service/Electrician", icon: Zap },
    { name: "IT Provider", path: "/main/find-service/IT Provider", icon: Code },
    { name: "Painter", path: "/main/find-service/Painter", icon: Palette },
  ];

  const headerClasses = bg === "white" 
    ? `backdrop-blur-xl bg-[#b1a99e]  border-white/20 shadow-lg ${isScrolled ? 'bg-white/20' : ''}` 
    : `backdrop-blur-xl bg-black/90 text-[#fff9ea] border-white/10 shadow-2xl ${isScrolled ? 'bg-black/95' : ''}`;

  const mobileMenuClasses = bg === "white"
    ? "backdrop-blur-xl bg-white/95 border-white/20 shadow-xl"
    : "backdrop-blur-xl text-[#fff9ea] bg-black/95 border-white/10 shadow-2xl";

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 z-50 right-0 left-0 lg:px-[60px] py-[10px] transition-all duration-300 ${headerClasses} border-b`}>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[50px]">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className={`text-[30px] primary font-bold transition-colors duration-300 `}>
                ZenEasy
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center space-x-[20px]">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    className={`px-3 py-2 rounded-lg text-[18px] font-medium transition-all duration-300 flex items-center space-x-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#e4ed64] after:transition-all after:duration-300 hover:after:w-full`}
                  >
                    <IconComponent size={16} />
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </nav>

            {/* Desktop Profile & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Profile Button (Desktop) */}
              <a
                href={`/main/profile/${selfId}`}
                   className={`px-3 py-2  hidden lg:flex rounded-lg text-[18px] font-semibold transition-all duration-300  items-center space-x-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#e4ed64] after:transition-all after:duration-300 hover:after:w-full`}
              >
                <User size={18} />
                <span className="text-[18px] font-semibold ">Profile</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className={`lg:hidden p-2 rounded-lg transition-all duration-300 `}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className={`absolute top-16 left-0 right-0 ${mobileMenuClasses} border-b max-h-[calc(100vh-4rem)] overflow-y-auto`}>
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 `}
                    onClick={toggleMobileMenu}
                  >
                    <IconComponent size={20} />
                    <span className="text-base font-medium">{link.name}</span>
                  </a>
                );
              })}
              
              {/* Mobile Profile Link */}
              <a
                href={`/main/profile/${selfId}`}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300`}
                onClick={toggleMobileMenu}
              >
                <User size={20} />
                <span className="text-base font-medium">Profile</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;