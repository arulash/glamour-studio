import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { SERVICES } from "@/data/site";
import { RitualsSection } from "@/pages/HomePage";

export default function ServicesPage() {
  return (
    <div data-testid="services-page" className="pt-32 pb-24 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <Reveal><div className="eyebrow">THE MENU</div></Reveal>
        <Reveal delay={120}>
          <h1 className="serif mt-6 text-5xl sm:text-6xl lg:text-7xl">
            <span className="text-white">Our </span>
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Services</span>
          </h1>
        </Reveal>
        <Reveal delay={220}>
          <p className="mt-6 text-white/55 max-w-2xl">
            Six rituals refined over years. Every service includes a complimentary hot towel finish.
          </p>
        </Reveal>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.id} delay={i * 100}>
                <div data-testid={`service-card-${s.id}`} className="card-dark p-9 flex flex-col h-full">
                  <Icon size={30} style={{ color: "var(--gold)" }} strokeWidth={1.3} />
                  <h3 className="serif text-2xl mt-7">{s.name}</h3>
                  <p className="text-white/55 text-sm leading-relaxed mt-3 flex-1">{s.desc}</p>
                  <div className="mt-7 flex items-center justify-between">
                    <span className="serif text-2xl" style={{ color: "var(--gold)" }}>₹{s.price}</span>
                    <span className="text-white/45 text-sm">{s.duration} mins</span>
                  </div>
                  <Link to="/booking" className="btn-outline-gold mt-6 w-full justify-center">BOOK NOW</Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="mt-24"><RitualsSection headingEyebrow="GLAMOUR RITUALS — SAVE MORE" /></div>
    </div>
  );
}
