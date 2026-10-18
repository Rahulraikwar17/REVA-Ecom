import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router";
import useAuth from "../../../features/auth/hook/useAuth";

import {
  Home,
  Package,
  Info,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Loader2,
  AlertCircle,
  Store,
  ChevronDown,
  PlusCircle,
  List,
} from "lucide-react";
import { useSelector } from "react-redux";

// Theme: cobalt blue (#0047AB), black, white

const links = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/products", label: "Products", icon: Package },
  { to: "/about", label: "About", icon: Info },
];

const sellerLinks = [
  { to: "/seller/products/new", label: "Add product", icon: PlusCircle },
  { to: "/seller/products", label: "All products", icon: List },
];

// Seller dropdown (desktop). Defined outside Navbar so it keeps its own state.
const SellerMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();
  const isActive = pathname.startsWith("/seller");

  // Close on outside click and on Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 ${
          isActive || open
            ? "border-[#0047AB] bg-[#0047AB] text-white"
            : "border-black bg-white text-black hover:bg-black hover:text-white"
        }`}
      >
        <Store size={17} />
        Seller
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-black/10 bg-white p-1.5 shadow-xl"
        >
          {sellerLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              role="menuitem"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#0047AB] text-white"
                    : "text-black hover:bg-neutral-100 hover:text-[#0047AB]"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { logOutUser, isLoggingOut, logOutError } = useAuth();

  // Adjust this selector to match your store shape
  const user = useSelector((state) => state.auth.user);
  const isSeller = user?.role === "seller";

  // Connect this to your cart state
  const cartCount = 0;

  const handleLogout = () => {
    if (isLoggingOut) return;
    logOutUser();
  };

  // Desktop link: underline marks the active page
  const desktopLinkClass = ({ isActive }) =>
    `flex items-center gap-2 border-b-2 px-3 py-5 text-sm font-medium transition ${
      isActive
        ? "border-[#0047AB] text-[#0047AB]"
        : "border-transparent text-black hover:text-[#0047AB]"
    }`;

  // Mobile link: left bar marks the active page
  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md border-l-4 px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "border-[#0047AB] bg-neutral-100 text-[#0047AB]"
        : "border-transparent text-black hover:bg-neutral-100"
    }`;

  const logoutBtnBase =
    "flex items-center justify-center gap-2 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-[#0047AB] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const logoutContent = isLoggingOut ? (
    <>
      <Loader2 size={17} className="animate-spin" />
      Logging out...
    </>
  ) : (
    <>
      <LogOut size={17} />
      Log out
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo (public/logo.png) */}
        <Link to="/home" aria-label="Go to home" className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden h-full items-center gap-2 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/home"}
                className={desktopLinkClass}
              >
                <Icon size={17} />
                {label}
              </NavLink>
            </li>
          ))}

          {isSeller && (
            <li className="ml-3">
              <SellerMenu />
            </li>
          )}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-md border border-black/15 text-black transition hover:border-[#0047AB] hover:text-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0047AB] px-1 text-[11px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`${logoutBtnBase} h-10 px-5`}
          >
            {logoutContent}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-black/15 text-black transition hover:border-[#0047AB] hover:text-[#0047AB] md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Logout error */}
      {logOutError && (
        <div className="border-t border-red-200 bg-red-50">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 text-sm text-red-600 sm:px-6 lg:px-8">
            <AlertCircle size={17} className="shrink-0" />
            <span>
              {logOutError?.response?.data?.message ||
                logOutError?.message ||
                "Logout failed. Please try again."}
            </span>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black/10 bg-white px-4 pb-5 pt-3 md:hidden">
          <ul className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/home"}
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              </li>
            ))}

            <li>
              <NavLink
                to="/cart"
                onClick={() => setOpen(false)}
                className={mobileLinkClass}
              >
                <ShoppingCart size={18} />
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0047AB] px-1.5 text-[11px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>

            {isSeller && (
              <li className="pt-3">
                <p className="px-4 pb-1 text-xs font-semibold text-[#0047AB]">
                  Seller
                </p>
                <ul className="space-y-1">
                  {sellerLinks.map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end
                        onClick={() => setOpen(false)}
                        className={mobileLinkClass}
                      >
                        <Icon size={18} />
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`${logoutBtnBase} mt-4 w-full py-3`}
          >
            {logoutContent}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;