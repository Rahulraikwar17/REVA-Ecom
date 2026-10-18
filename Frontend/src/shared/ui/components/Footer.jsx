import React, { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";

const SocialIcon = ({ href = "#", label, children }) => (
  <a
    href={href}
    aria-label={label}
    className="flex h-10 w-10 items-center justify-center rounded-md border border-white/25 text-white transition hover:border-[#0047AB] hover:bg-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
  >
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  </a>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-white/70 transition hover:text-white hover:underline hover:underline-offset-4"
    >
      {children}
    </Link>
  </li>
);

const Footer = ({ brand = "REVA" }) => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Connect your newsletter API here
    setDone(true);
    setEmail("");
  };

  return (
    <footer>
      {/* Main links */}
      <div className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 lg:px-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link
              to="/home"
              aria-label={`${brand} home`}
              className="inline-flex"
            >
              {/* The logo is black, so it is inverted to white on this background */}
              <img
                src="/logo.png"
                alt={brand}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Everyday clothing at honest prices. Made to be worn, loved and
              repeated.
            </p>

            <div className="mt-6 flex gap-3">
              <SocialIcon label="Instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </SocialIcon>
              <SocialIcon label="Facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </SocialIcon>
              <SocialIcon label="Twitter">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </SocialIcon>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2">
            <h4 className="text-base font-semibold">Shop</h4>
            <ul className="mt-5 space-y-3">
              <FooterLink to="/home">Home</FooterLink>
              <FooterLink to="/products">All products</FooterLink>
              <FooterLink to="/cart">My cart</FooterLink>
              <FooterLink to="/about">About us</FooterLink>
            </ul>
          </div>

          {/* Help */}
          <div className="md:col-span-2">
            <h4 className="text-base font-semibold">Help</h4>
            <ul className="mt-5 space-y-3">
              <FooterLink to="/about">Shipping info</FooterLink>
              <FooterLink to="/about">Returns &amp; exchange</FooterLink>
              <FooterLink to="/about">Size guide</FooterLink>
              <FooterLink to="/about">FAQs</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-base font-semibold">Contact</h4>
            <ul className="mt-5 space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                support@reva.com
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                Bhopal, Madhya Pradesh, India
              </li>
            </ul>
            <p className="mt-5 text-xs text-white/50">
              Mon to Sat, 10am to 6pm
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6 lg:px-8">
            <p>
              © {year} {brand}. All rights reserved.
            </p>
            <p>We accept UPI, cards, net banking and cash on delivery</p>
            <div className="flex gap-5">
              <Link to="/" className="transition hover:text-white">
                Privacy policy
              </Link>
              <Link to="/" className="transition hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
