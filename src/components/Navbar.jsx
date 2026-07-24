import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import logo from '../assets/logo.webp';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const links = [
    { name: 'Why Counselling?', href: '#why-counseling' },
    { name: 'Courses', href: '#courses' },
    { name: 'Packages', href: '#packages' },
    { name: 'About Me', href: '#about-me' },
  ];

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollToHash: href } });
    }
  };

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
            <span className="text-2xl font-bold tracking-tight transition-colors" style={{ color: 'var(--neu-accent)' }}>
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
                    className="text-sm font-medium transition-colors"
                    style={{ color: 'var(--neu-text-muted)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--neu-accent)'}
                    onMouseLeave={e => e.target.style.color = 'var(--neu-text-muted)'}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 bg-stone-200 dark:bg-stone-900 border border-stone-300 dark:border-stone-850 hover:bg-stone-300 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
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
                className="glass-btn-primary px-5 py-2.5 text-sm cursor-pointer font-bold border-none"
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
            className="fixed top-20 left-0 right-0 z-40 bg-[#f7f3ec]/95 dark:bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-[rgba(184,121,31,0.15)] dark:border-[rgba(240,168,56,0.15)] shadow-2xl md:hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
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
