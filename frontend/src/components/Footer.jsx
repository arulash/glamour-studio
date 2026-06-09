import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone } from "lucide-react";
import { SALON } from "@/data/site";

export default function Footer() {
  return (
    <footer data-testid="site-footer" style={{ background: "#0d0d0d" }} className="border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 grid md:grid-cols-3 gap-12">
        <div>
          <div className="serif text-3xl">
            <span className="text-white">Glamour</span>{" "}
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Studio</span>
          </div>
          <p className="mt-5 text-white/55 leading-relaxed max-w-sm text-sm">
            Bangalore&apos;s premium grooming lounge. Calm, exacting and built for the modern man.
          </p>
          <div className="mt-6 flex items-center gap-3 text-white/45 text-xs tracking-[0.22em] uppercase">
            <span style={{ width: 30, height: 1, background: "var(--gold)" }} />
            ESTD · KOramaNGALA
          </div>
        </div>

        <div className="space-y-4 text-sm text-white/70">
          <div className="eyebrow">VISIT</div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-1" style={{ color: "var(--gold)" }} />
            <span>{SALON.address}</span>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={16} className="mt-1" style={{ color: "var(--gold)" }} />
            <span>{SALON.phone}</span>
          </div>
          <p className="text-white/50">{SALON.hours}</p>
          <p className="font-italic-serif" style={{ color: "var(--gold)" }}>{SALON.closed}</p>
        </div>

        <div className="space-y-5">
          <div className="eyebrow">FOLLOW</div>
          <a
            data-testid="footer-instagram"
            href={`https://instagram.com/${SALON.instagram.replace("@", "")}`}
            target="_blank" rel="noreferrer"
            className="flex items-center gap-3 text-white/80 hover:text-[color:var(--gold)] transition-colors"
          >
            <Instagram size={18} />
            <span className="text-sm">{SALON.instagram}</span>
          </a>
          <Link to="/booking" data-testid="footer-book-now" className="btn-gold btn-sm mt-2">BOOK NOW</Link>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "rgba(201,168,76,0.18)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 text-xs text-white/35 tracking-wider">
          © {new Date().getFullYear()} GLAMOUR STUDIO · ALL RIGHTS RESERVED · KOramaNGALA, BANGALORE
        </div>
      </div>
    </footer>
  );
}
