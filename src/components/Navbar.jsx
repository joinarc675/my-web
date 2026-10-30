import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import logo from '../assets/logo.webp';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMoreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '#courses' },
    { name: 'Packages', href: '#packages' },
    { name: 'About Me', href: '#about-me' },
  ];

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setMoreDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setMoreDropdownOpen(false);
    }, 180);
  };

  const handleNavigate = (path) => {
    setMoreDropdownOpen(false);
    setIsOpen(false);
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    setMoreDropdownOpen(false);
    if (href === '/') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }
    if (location.pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollToHash: href } });
    }
  };

  const isMoreActive = ['/career-mentorship', '/career-counselling', '/career'].includes(location.pathname);

  return (
    <>
      <nav className={`glass-nav ${isScrolled ? 'glass-nav-active' : ''} fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
        <div className="container mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
          >
            <img src={logo} alt="ARC Logo" width="32" height="32" decoding="async" className="h-8 w-auto" />
            <span className="text-2xl font-bold font-playfair tracking-tight transition-colors" style={{ color: 'var(--neu-accent)' }}>
              ARC
            </span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                    className="text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--neu-accent)] focus-visible:rounded"
                    style={{
                      color:
                        link.href === '/' && location.pathname === '/'
                          ? 'var(--neu-accent)'
                          : 'var(--neu-text-muted)',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--neu-accent)')}
                    onMouseLeave={(e) => {
                      e.target.style.color =
                        link.href === '/' && location.pathname === '/'
                          ? 'var(--neu-accent)'
                          : 'var(--neu-text-muted)';
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}

              {/* More Dropdown Menu */}
              <li
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={moreDropdownOpen}
                  aria-label="More menu"
                  className="text-sm font-medium transition-colors flex items-center gap-1 py-2 cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--neu-accent)] focus-visible:rounded"
                  style={{
                    color: isMoreActive ? 'var(--neu-accent)' : 'var(--neu-text-muted)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--neu-accent)')}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isMoreActive
                      ? 'var(--neu-accent)'
                      : 'var(--neu-text-muted)';
                  }}
                >
                  <span>More</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      moreDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {moreDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-1.5 w-52 rounded-xl p-1.5 shadow-xl backdrop-blur-xl z-50 bg-[#f7f3ec]/98 dark:bg-[#161616]/98 border border-stone-300 dark:border-stone-800"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleNavigate('/career-mentorship')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between cursor-pointer border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[var(--neu-accent)] ${
                          isMoreActive
                            ? 'text-[var(--neu-accent)] bg-[var(--neu-accent)]/10 font-semibold'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800/80 hover:text-[var(--neu-accent)]'
                        }`}
                      >
                        <span>Career Mentorship</span>
                        {isMoreActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neu-accent)]" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 bg-stone-200 dark:bg-stone-900 border border-stone-300 dark:border-stone-850 hover:bg-stone-300 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--neu-accent)]"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" style={{ color: 'var(--neu-accent)' }} />
                ) : (
                  <Moon className="w-4 h-4" style={{ color: 'var(--neu-accent)' }} />
                )}
              </button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/booking')}
                className="glass-btn-primary px-5 py-2.5 text-sm cursor-pointer font-bold border-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--neu-accent)]"
              >
                Book Session
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Toggle & Theme Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-stone-200 dark:bg-stone-900 border border-stone-300 dark:border-stone-850 hover:bg-stone-300 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" style={{ color: 'var(--neu-accent)' }} />
              ) : (
                <Moon className="w-4 h-4" style={{ color: 'var(--neu-accent)' }} />
              )}
            </button>
            <button
              className="p-2.5 text-stone-600 dark:text-stone-300 bg-stone-200 dark:bg-[#161616] border border-stone-300 dark:border-white/10 hover:bg-stone-300 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 bg-[#f7f3ec]/95 dark:bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-[rgba(184,121,31,0.15)] dark:border-[rgba(240,168,56,0.15)] shadow-2xl md:hidden max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-3">
              {/* Navigation Links (Home, Courses, Packages, About Me) */}
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-medium py-2 border-b border-stone-300 dark:border-stone-850 hover:text-[var(--neu-accent)] transition-colors text-stone-800 dark:text-stone-200"
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}

              {/* Mobile More with Dropdown / Submenu */}
              <div className="border-b border-stone-300 dark:border-stone-850 pb-2">
                <button
                  type="button"
                  onClick={() => setMobileMoreOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between py-2 font-medium text-stone-800 dark:text-stone-200 hover:text-[var(--neu-accent)] transition-colors cursor-pointer bg-transparent border-none text-left"
                  aria-expanded={mobileMoreOpen}
                >
                  <span
                    className={
                      isMoreActive ? 'text-[var(--neu-accent)] font-semibold' : ''
                    }
                  >
                    More
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileMoreOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {mobileMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-3 pt-1 flex flex-col gap-1.5"
                    >
                      <button
                        type="button"
                        onClick={() => handleNavigate('/career-mentorship')}
                        className={`text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none bg-transparent flex items-center justify-between ${
                          isMoreActive
                            ? 'text-[var(--neu-accent)] bg-[var(--neu-accent)]/10 font-semibold'
                            : 'text-stone-600 dark:text-stone-400 hover:text-[var(--neu-accent)]'
                        }`}
                      >
                        <span>Career Mentorship</span>
                        {isMoreActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neu-accent)]" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                className="glass-btn-primary w-full py-3 text-sm mt-2 cursor-pointer font-bold border-none"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/booking');
                }}
              >
                Book Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
