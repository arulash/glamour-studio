import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, MapPin, Clock } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import BeforeAfter from "@/components/BeforeAfter";
import { HERO_VIDEO, SERVICES, RITUALS, WHY_HOME, TESTIMONIALS, BEFORE_AFTER, SALON } from "@/data/site";
import { useEffect, useRef } from "react";

const homeServices = ["haircut", "shave", "massage"];

export default function HomePage() {
  const videoRef = useRef(null);
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = 0.55; }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative w-full h-[100vh] min-h-[640px] overflow-hidden">
        <video
          ref={videoRef}
          data-testid="hero-video"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={HERO_VIDEO}
          poster=""
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.62)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(10,10,10,0.95) 100%)" }} />

        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center">
          <div className="max-w-3xl">
            <Reveal>
              <div className="eyebrow">ESTABLISHED IN KAMMANAHALLI</div>
            </Reveal>
            <Reveal delay={150}>
              <h1 className="serif mt-8 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.02] tracking-tight">
                <span className="text-white">Bangalore&apos;s </span>
                <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Premium</span>
                <br />
                <span className="text-white">Grooming Experience</span>
              </h1>
            </Reveal>
            <Reveal delay={350}>
              <p className="mt-7 text-white/65 text-base lg:text-lg max-w-xl leading-relaxed">
                A calm, exacting lounge for men who care about how they walk into a room.
                Italian shears, single-use blades, honest craft.
              </p>
            </Reveal>
            <Reveal delay={500}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/booking" data-testid="hero-book-now" className="btn-gold">
                  BOOK NOW <ArrowRight size={14} />
                </Link>
                <Link to="/services" data-testid="hero-view-services" className="btn-outline-gold">
                  VIEW SERVICES
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/40 text-[0.65rem] tracking-[0.4em]">
          SCROLL
        </div>
      </section>

      {/* SIGNATURE SERVICES */}
      <section className="py-28 lg:py-36" style={{ background: "var(--bg-3)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <Reveal><div className="eyebrow">OUR CRAFT</div></Reveal>
          <Reveal delay={120}>
            <h2 className="serif mt-6 text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-white">Signature </span>
              <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Services</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 max-w-xl text-white/55">A short, sharp menu. Every service finished with a hot towel.</p>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {homeServices.map((id, i) => {
              const s = SERVICES.find(x => x.id === id);
              const Icon = s.icon;
              return (
                <Reveal key={s.id} delay={i * 120}>
                  <div data-testid={`signature-card-${s.id}`} className="card-dark p-10 h-full flex flex-col" style={{ background: "var(--bg-5)" }}>
                    <Icon size={34} style={{ color: "var(--gold)" }} strokeWidth={1.3} />
                    <h3 className="serif text-2xl lg:text-3xl mt-8">{s.name}</h3>
                    <p className="text-white/55 mt-3 text-sm leading-relaxed flex-1">{s.desc}</p>
                    <div className="mt-8 flex items-center justify-between">
                      <div className="serif text-2xl" style={{ color: "var(--gold)" }}>₹{s.price}</div>
                      <Link to="/booking" className="text-[0.7rem] tracking-[0.22em] flex items-center gap-2 hover:gap-3 transition-all" style={{ color: "var(--gold)" }}>
                        BOOK NOW <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={400}>
            <div className="mt-14 text-center">
              <Link to="/services" data-testid="view-all-services" className="btn-outline-gold">VIEW ALL SERVICES</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GLAMOUR RITUALS */}
      <RitualsSection />

      {/* WHY CHOOSE US */}
      <section className="py-28 lg:py-36 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <Reveal><h2 className="serif text-4xl sm:text-5xl lg:text-6xl text-center">
            <span className="text-white">Why Choose </span>
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Us</span>
          </h2></Reveal>
          <div className="mt-20 grid md:grid-cols-3 gap-10">
            {WHY_HOME.map((w, i) => (
              <Reveal key={w.title} delay={i * 140}>
                <div className="text-center px-6">
                  <div className="inline-flex items-center justify-center" style={{ width: 70, height: 70, border: "1px solid var(--gold)", borderRadius: 999 }}>
                    <w.icon size={26} style={{ color: "var(--gold)" }} strokeWidth={1.3} />
                  </div>
                  <h3 className="serif text-2xl mt-7">{w.title}</h3>
                  <p className="text-white/55 mt-3 leading-relaxed text-sm">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section className="py-28 lg:py-36" style={{ background: "var(--bg-3)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <Reveal><div className="eyebrow">TRANSFORMATIONS</div></Reveal>
          <Reveal delay={120}><h2 className="serif mt-6 text-4xl sm:text-5xl lg:text-6xl">
            <span className="text-white">See The </span>
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Difference</span>
          </h2></Reveal>
          <Reveal delay={220}><p className="mt-4 text-white/55">Real clients. Real craft.</p></Reveal>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {BEFORE_AFTER.map((src, i) => (
              <Reveal key={i} delay={i * 130}>
                <BeforeAfter src={src} idx={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 lg:py-36" style={{ background: "#141414" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <Reveal><h2 className="serif text-4xl sm:text-5xl lg:text-6xl text-center">
            <span className="text-white">What Our </span>
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Clients</span>
            <span className="text-white"> Say</span>
          </h2></Reveal>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 140}>
                <div data-testid={`testimonial-${i}`} className="p-9 h-full flex flex-col" style={{ background: "#1e1e1e", borderTop: "2px solid var(--gold)" }}>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, k) => <Star key={k} size={15} fill="var(--gold)" stroke="var(--gold)" />)}
                  </div>
                  <p className="serif italic mt-6 text-white/85 leading-relaxed flex-1">&ldquo;{t.body}&rdquo;</p>
                  <div className="mt-8 text-[0.72rem] tracking-[0.28em]" style={{ color: "var(--gold)" }}>{t.name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FIND US */}
      <section className="bg-black">
        <div className="grid lg:grid-cols-2">
          <div className="px-6 lg:px-16 py-24 lg:py-32 flex flex-col justify-center">
            <Reveal><div className="eyebrow">VISIT</div></Reveal>
            <Reveal delay={120}>
              <h2 className="serif mt-6 text-4xl sm:text-5xl lg:text-6xl">
                <span className="text-white">Find </span>
                <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Us</span>
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-8 space-y-4 text-white/75">
                <div className="flex items-start gap-4"><MapPin size={18} style={{ color: "var(--gold)" }} /><span>{SALON.address}</span></div>
                <div className="flex items-start gap-4"><Clock size={18} style={{ color: "var(--gold)" }} /><span>{SALON.hours}</span></div>
                <div className="font-italic-serif pl-9" style={{ color: "var(--gold)" }}>{SALON.closed}</div>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/contact" className="btn-outline-gold">CONTACT US</Link>
                <Link to="/booking" className="btn-gold">BOOK NOW</Link>
              </div>
            </Reveal>
          </div>
          <div className="min-h-[420px] lg:min-h-0">
            <iframe
              title="map"
              src={SALON.mapsEmbed}
              className="w-full h-full"
              style={{ minHeight: 420, border: 0, filter: "grayscale(0.6) contrast(0.95) brightness(0.85)" }}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function RitualsSection({ headingEyebrow = "GLAMOUR RITUALS", showFootnote = true }) {
  return (
    <section className="py-28 lg:py-36 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center">
          <Reveal><div className="eyebrow justify-center" style={{ justifyContent: "center" }}>{headingEyebrow}</div></Reveal>
          <Reveal delay={120}>
            <h2 className="serif mt-6 text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-white">The Complete </span>
              <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Experience</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-white/55 max-w-2xl mx-auto">
              Curated combinations — more for less. Every ritual includes our signature hot towel finish.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-7">
          {RITUALS.map((r, i) => (
            <Reveal key={r.id} delay={i * 130}>
              <RitualCard ritual={r} />
            </Reveal>
          ))}
        </div>

        {showFootnote && (
          <Reveal delay={500}>
            <p className="mt-10 text-center text-white/45 font-italic-serif text-sm">
              All rituals available as standalone bookings too.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function RitualCard({ ritual }) {
  const items = ritual.items.map(id => SERVICES.find(s => s.id === id));
  const popular = ritual.popular;
  return (
    <div
      data-testid={`ritual-card-${ritual.id}`}
      className="relative p-8 lg:p-9 h-full flex flex-col transition-all duration-500"
      style={{
        background: popular ? "#1c1c1c" : "var(--bg-3)",
        border: popular ? "1px solid var(--gold)" : "1px solid #2a2a2a",
        boxShadow: popular ? "0 0 60px -25px rgba(201,168,76,0.4)" : "none"
      }}
    >
      {popular && (
        <span
          className="absolute -top-3 right-6 text-[0.62rem] tracking-[0.28em] px-3 py-1.5"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          MOST POPULAR
        </span>
      )}
      <div className="text-[0.7rem] tracking-[0.3em] font-italic-serif" style={{ color: "var(--gold)" }}>
        {ritual.label}
      </div>
      <h3 className="serif text-3xl lg:text-4xl mt-3">{ritual.name}</h3>
      <p className="font-italic-serif text-white/50 mt-3 text-sm">{ritual.tag}</p>

      <div className="mt-6" style={{ height: 1, background: "var(--gold)", width: 48 }} />

      <ul className="mt-6 space-y-3">
        {items.map(it => (
          <li key={it.id} className="flex items-start gap-3 text-sm">
            <Check size={16} style={{ color: "var(--gold)", marginTop: 3 }} />
            <span className="flex-1 flex justify-between gap-3">
              <span className="text-white/90">{it.short}</span>
              <span className="text-white/35 line-through">₹{it.price}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-7" style={{ height: 1, background: "var(--gold)", opacity: 0.4 }} />

      <div className="mt-6 flex items-baseline justify-between">
        <span className="text-[0.7rem] tracking-[0.26em]" style={{ color: "var(--gold)" }}>YOU SAVE</span>
        <span className="serif text-2xl" style={{ color: "var(--gold)" }}>₹{ritual.save}</span>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="serif text-4xl">₹{ritual.price.toLocaleString("en-IN")}</span>
        <span className="text-xs text-white/40">per visit · all inclusive</span>
      </div>

      <a href={`/booking?ritual=${ritual.id}`} className="btn-gold w-full justify-center mt-8" data-testid={`book-ritual-${ritual.id}`}>
        BOOK THIS RITUAL
      </a>
    </div>
  );
}
