import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { TEAM, WHY_ABOUT } from "@/data/site";

export default function AboutPage() {
  return (
    <div data-testid="about-page" className="pt-32 pb-24 bg-black">
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Reveal><div className="eyebrow">OUR STORY</div></Reveal>
            <Reveal delay={120}>
              <h1 className="serif mt-6 text-5xl sm:text-6xl lg:text-7xl leading-[1.02]">
                <span className="text-white">A New </span>
                <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Standard</span>
                <span className="text-white"> Of Grooming</span>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 text-white/65 leading-relaxed">
                Glamour Studio was born from a simple frustration — why is it that men in Bangalore had no proper place to be groomed?
                Loud salons, distracted barbers, rushed cuts. We built the antidote.
              </p>
            </Reveal>
            <Reveal delay={340}>
              <p className="mt-5 text-white/65 leading-relaxed">
                Tucked into 5th Block Koramangala, our lounge is dim, calm, and exacting. Every chair, every blade,
                every product is chosen for one reason — to make you walk out feeling like the best version of yourself.
              </p>
            </Reveal>
            <Reveal delay={460}>
              <Link to="/booking" className="btn-outline-gold mt-10">RESERVE YOUR CHAIR</Link>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div
              data-testid="story-image-placeholder"
              className="relative w-full"
              style={{
                aspectRatio: "3 / 4",
                background: "linear-gradient(180deg, #1a1a1a 0%, #0e0e0e 100%)",
                border: "1px solid var(--gold)"
              }}
            >
              <div className="absolute inset-6 flex items-center justify-center text-white/30 text-xs tracking-[0.3em]">
                STORY IMAGE
              </div>
              <span className="absolute top-4 left-4 text-[0.62rem] tracking-[0.3em]" style={{ color: "var(--gold)" }}>
                · ESTD KOramaNGALA
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TEAM */}
      <section className="mt-32 max-w-[1400px] mx-auto px-6 lg:px-12">
        <Reveal><div className="eyebrow">THE CHAIRS</div></Reveal>
        <Reveal delay={120}>
          <h2 className="serif mt-6 text-4xl sm:text-5xl lg:text-6xl">
            <span className="text-white">Meet Our </span>
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Team</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 130}>
              <div data-testid={`team-card-${m.name.toLowerCase()}`} className="card-dark p-0 overflow-hidden">
                <div className="w-full" style={{ aspectRatio: "4 / 5", overflow: "hidden" }}>
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    style={{ filter: "contrast(1.05) saturate(0.9)" }}
                  />
                </div>
                <div className="p-7">
                  <h3 className="serif text-2xl">{m.name}</h3>
                  <div className="text-[0.7rem] tracking-[0.28em] mt-2" style={{ color: "var(--gold)" }}>{m.title}</div>
                  <p className="font-italic-serif text-white/50 text-sm mt-3">{m.exp}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY GLAMOUR */}
      <section className="mt-32 max-w-[1400px] mx-auto px-6 lg:px-12">
        <Reveal>
          <h2 className="serif text-4xl sm:text-5xl lg:text-6xl text-center">
            <span className="text-white">Why </span>
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Glamour</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_ABOUT.map((w, i) => (
            <Reveal key={w.title} delay={i * 90}>
              <div className="card-dark p-8 h-full">
                <div className="inline-flex items-center justify-center" style={{ width: 56, height: 56, border: "1px solid var(--gold)" }}>
                  <w.icon size={22} style={{ color: "var(--gold)" }} strokeWidth={1.3} />
                </div>
                <h3 className="serif text-xl mt-6">{w.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mt-3">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
