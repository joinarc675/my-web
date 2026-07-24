import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';

export default function Footer() {
  return (
    <footer className="flat-footer py-12 text-[var(--neu-text-muted)] bg-[var(--neu-card-bg)] border-t border-[var(--neu-border)] transition-all duration-300">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Col */}
          <div className="space-y-4">
            <a href="#" className="flex items-center gap-2">
              <img src={logo} alt="ARC Logo" width="32" height="32" loading="lazy" decoding="async" className="h-8 w-auto" />
              <span className="text-2xl font-bold font-playfair tracking-tight transition-colors" style={{ color: 'var(--neu-accent)' }}>
                ARC
              </span>
            </a>
            <p className="text-sm leading-relaxed text-[var(--neu-text-muted)] transition-colors duration-300">
              Abdul Rehman Cheema — Islamic counselor blending Psychology, Neuroscience, and Shariah to provide practical guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-wider text-[var(--neu-text)] transition-colors duration-300">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#home"
                  className="transition-colors text-[var(--neu-text-muted)] hover:text-[var(--neu-accent)]"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#why-counseling"
                  className="transition-colors text-[var(--neu-text-muted)] hover:text-[var(--neu-accent)]"
                >
                  Why Counselling?
                </a>
              </li>
              <li>
                <a
                  href="#packages"
                  className="transition-colors text-[var(--neu-text-muted)] hover:text-[var(--neu-accent)]"
                >
                  Packages
                </a>
              </li>
              <li>
                <a
                  href="#about-me"
                  className="transition-colors text-[var(--neu-text-muted)] hover:text-[var(--neu-accent)]"
                >
                  About Me
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-wider text-[var(--neu-text)] transition-colors duration-300">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-[var(--neu-text)] transition-colors duration-300">
                <Mail className="w-4 h-4 text-[var(--neu-accent)] flex-shrink-0 transition-colors duration-300" />
                <span>info@abdulrehmancheema.com</span>
              </li>
              <li className="flex items-center gap-3 text-[var(--neu-text)] transition-colors duration-300">
                <Phone className="w-4 h-4 text-[var(--neu-accent)] flex-shrink-0 transition-colors duration-300" />
                <span>+92 (345) 861-2538</span>
              </li>
              <li className="flex items-center gap-3 text-[var(--neu-text)] transition-colors duration-300">
                <MessageCircle className="w-4 h-4 text-[var(--neu-accent)] flex-shrink-0 transition-colors duration-300" />
                <span>WhatsApp: +92 (345) 861-2538</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-wider text-[var(--neu-text)] transition-colors duration-300">Stay Updated</h4>
            <p className="text-xs mb-4 text-[var(--neu-text-muted)] transition-colors duration-300">
              Subscribe to our newsletter for insights and updates.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--neu-base)] border border-[var(--neu-border)] text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-accent)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all placeholder:text-[var(--neu-text-faint)]"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-bold rounded-xl bg-[var(--neu-accent)] text-[var(--neu-base)] hover:bg-[var(--neu-accent-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <hr className="my-8 border-[var(--neu-border)] transition-colors duration-300" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--neu-text-faint)] transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>© {new Date().getFullYear()} Abdul Rehman Cheema (ARC). All rights reserved.</p>
            <span className="hidden md:inline text-[var(--neu-border-solid)]">·</span>
            <p>Developed by <span className="text-[var(--neu-accent)] font-semibold">Mahar GM</span></p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/privacy"
              className="transition-colors hover:text-[var(--neu-accent)]"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="transition-colors hover:text-[var(--neu-accent)]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
