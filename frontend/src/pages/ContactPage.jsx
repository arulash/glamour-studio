import { useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";
import { SALON } from "@/data/site";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Please fill all fields.");
      return;
    }
    toast.success("Message sent. We'll be in touch shortly.");
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div data-testid="contact-page" className="pt-32 pb-24 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <Reveal><div className="eyebrow">GET IN TOUCH</div></Reveal>
        <Reveal delay={120}>
          <h1 className="serif mt-6 text-5xl sm:text-6xl lg:text-7xl">
            <span className="text-white">Say </span>
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Hello</span>
          </h1>
        </Reveal>

        <div className="mt-16 grid lg:grid-cols-2 gap-7">
          {/* INFO + MAP */}
          <Reveal>
            <div className="card-dark p-10 lg:p-12 h-full" style={{ borderColor: "var(--gold)" }}>
              <div className="space-y-7 text-white/85">
                <div className="flex items-start gap-4">
                  <Phone size={18} style={{ color: "var(--gold)", marginTop: 4 }} />
                  <div>
                    <div className="text-[0.7rem] tracking-[0.26em] text-white/45 mb-1">PHONE</div>
                    <div className="serif text-lg">{SALON.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin size={18} style={{ color: "var(--gold)", marginTop: 4 }} />
                  <div>
                    <div className="text-[0.7rem] tracking-[0.26em] text-white/45 mb-1">ADDRESS</div>
                    <div className="serif text-lg leading-snug">{SALON.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={18} style={{ color: "var(--gold)", marginTop: 4 }} />
                  <div>
                    <div className="text-[0.7rem] tracking-[0.26em] text-white/45 mb-1">HOURS</div>
                    <div className="serif text-lg">{SALON.hours}</div>
                    <div className="font-italic-serif mt-2" style={{ color: "var(--gold)" }}>{SALON.closed}</div>
                  </div>
                </div>
              </div>
              <div className="mt-10" style={{ aspectRatio: "16/10" }}>
                <iframe
                  title="map"
                  src={SALON.mapsEmbed}
                  className="w-full h-full"
                  style={{ border: 0, filter: "grayscale(0.6) brightness(0.85)" }}
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          {/* FORM */}
          <Reveal delay={150}>
            <form onSubmit={submit} data-testid="contact-form" className="card-dark p-10 lg:p-12 h-full">
              <h2 className="serif text-3xl lg:text-4xl">
                <span className="text-white">Drop us a </span>
                <span className="font-italic-serif" style={{ color: "var(--gold)" }}>line</span>
              </h2>
              <p className="text-white/55 mt-3 text-sm">Tell us what you need. We typically reply within a couple of hours during open days.</p>

              <div className="mt-10 space-y-7">
                <div>
                  <label className="field-label">FULL NAME</label>
                  <input data-testid="contact-name" className="field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">PHONE NUMBER</label>
                  <input data-testid="contact-phone" className="field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} inputMode="tel" />
                </div>
                <div>
                  <label className="field-label">MESSAGE</label>
                  <textarea data-testid="contact-message" className="field" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
              </div>

              <button data-testid="contact-submit" type="submit" className="btn-gold w-full justify-center mt-10">SEND MESSAGE</button>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
