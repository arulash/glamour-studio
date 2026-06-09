import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "HOME" },
  { to: "/services", label: "SERVICES" },
  { to: "/about", label: "ABOUT" },
  { to: "/contact", label: "CONTACT" },
  { to: "/booking", label: "BOOKING" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 24);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const transparent = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      data-testid="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: transparent ? "transparent" : "rgba(17,17,17,0.92)",
        backdropFilter: transparent ? "none" : "blur(14px)",
        borderBottom: transparent ? "1px solid transparent" : "1px solid rgba(201,168,76,0.08)"
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link to="/" data-testid="logo-link" className="serif text-2xl tracking-wide select-none">
          <span className="text-white">Glamour</span>{" "}
          <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Studio</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-[0.72rem] tracking-[0.22em] font-medium transition-colors duration-300 ${
                  isActive ? "text-[color:var(--gold)]" : "text-white/85 hover:text-[color:var(--gold)]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/booking"
            data-testid="nav-book-now-btn"
            className="btn-outline-gold btn-sm"
          >
            BOOK NOW
          </Link>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen(o => !o)}
          className="lg:hidden text-white"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="lg:hidden border-t border-white/5"
          style={{ background: "rgba(10,10,10,0.98)" }}
        >
          <div className="px-6 py-6 flex flex-col gap-5">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-sm tracking-[0.22em] ${isActive ? "text-[color:var(--gold)]" : "text-white/85"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/booking" data-testid="mobile-book-now-btn" className="btn-outline-gold btn-sm w-fit">BOOK NOW</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
