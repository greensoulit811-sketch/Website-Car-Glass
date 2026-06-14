import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Percent, Clock, Facebook, Instagram, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

// Custom TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'HOME', path: '/' },
    // { title: 'TINT', path: '/tint' },
    // { title: 'ACCESSORIES', path: '/accessories' },
    // { title: 'GALLERY', path: '/gallery' },
    // { title: 'BLOG', path: '/blog' },
    // { title: 'CONTACT US', path: '/contact' },
    { title: 'APPOINTMENT', path: '/appointment' },
  ];

  const tealColor = "#00d5b4";

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-[100] font-sans shadow-lg">
      {/* Top Bar */}
      <div className={`bg-[#242938] text-gray-300 transition-all duration-300 overflow-hidden ${scrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-[300px] opacity-100 py-2 md:py-0 md:h-[42px]'}`}>
        <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-center md:justify-between">
          
          {/* Mobile Layout */}
          <div className="flex flex-col md:hidden items-center justify-center gap-1.5 text-[11px] w-full text-center">
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin size={12} color={tealColor} className="shrink-0" />
                <span>Shah Alam, Selangor</span>
              </div>
              <div className="flex items-center gap-1.5 text-white font-medium">
                <Phone size={12} color={tealColor} className="shrink-0" />
                <span>+60103660467</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock size={12} color={tealColor} className="shrink-0" />
                <span>09.00AM - 09.00PM</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[#00d5b4] bg-[#00d5b4]/10 px-3 py-0.5 rounded-full mt-0.5">
              <Percent size={12} color={tealColor} className="shrink-0" />
              <span>Discount 25% for every service</span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center text-[13px] w-full">
            {/* Left side */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin size={15} color={tealColor} className="shrink-0" />
                <span>13, Jln Setia Gemilang BG U13/BG, 40170 Shah Alam, Selangor</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-white">
                <Phone size={15} color={tealColor} className="shrink-0" />
                <span>+60103660467</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-bold text-[#00d5b4]">
                <Percent size={15} color={tealColor} className="shrink-0" />
                <span>Discount 25% for every service</span>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <Clock size={15} color={tealColor} className="shrink-0" />
                <span>09.00AM - 09.00PM</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Bar */}
      <div className="bg-[#13192b]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img src="/logos.png" alt="UVISION AUTO" className="h-16 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-6 xl:gap-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.title} 
                    to={link.path}
                    className={`text-[15px] font-black tracking-wider transition-colors ${
                      location.pathname === link.path || (link.title === 'HOME' && location.pathname === '/')
                        ? 'text-[#00d5b4]' 
                        : 'text-white hover:text-[#00d5b4]'
                    }`}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Icons & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2.5">
                <a href="https://www.facebook.com/share/p/1CFn9qVVpY/" className="w-8 h-8 flex items-center justify-center bg-[#00d5b4] hover:bg-[#00c0a0] transition-colors rounded-sm">
                  <Facebook size={18} className="text-black fill-black" />
                </a>
                <a href="https://www.instagram.com/sjtintedshop?igsh=bHB1cndraDZpdW44" className="w-8 h-8 flex items-center justify-center bg-[#00d5b4] hover:bg-[#00c0a0] transition-colors rounded-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://www.tiktok.com/@sjtintedandaccess?_r=1&_t=ZS-97CDN6hJxy9" className="w-8 h-8 flex items-center justify-center bg-[#00d5b4] hover:bg-[#00c0a0] transition-colors rounded-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </a>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2 text-white hover:text-[#00d5b4]"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#13192b] border-t border-gray-800 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.title} 
                to={link.path}
                className={`block text-[15px] font-black tracking-wider ${
                  location.pathname === link.path || (link.title === 'HOME' && location.pathname === '/')
                    ? 'text-[#00d5b4]' 
                    : 'text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            
            <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
              <a href="https://www.facebook.com/share/p/1CFn9qVVpY/" className="w-8 h-8 flex items-center justify-center bg-[#00d5b4] hover:bg-[#00c0a0] rounded-sm">
                <Facebook size={18} className="text-black fill-black" />
              </a>
              <a href="https://www.instagram.com/sjtintedshop?igsh=bHB1cndraDZpdW44" className="w-8 h-8 flex items-center justify-center bg-[#00d5b4] hover:bg-[#00c0a0] rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.tiktok.com/@sjtintedandaccess?_r=1&_t=ZS-97CDN6hJxy9" className="w-8 h-8 flex items-center justify-center bg-[#00d5b4] hover:bg-[#00c0a0] rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
