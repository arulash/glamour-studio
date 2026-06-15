import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { createWalkIn } from "@/lib/supabase";

const SERVICES = [
  { id: "haircut", name: "Haircut",      price: 300, duration: 45 },
  { id: "beard",   name: "Beard Trim",   price: 200, duration: 30 },
  { id: "facial",  name: "Facial",       price: 500, duration: 60 },
  { id: "massage", name: "Head Massage", price: 250, duration: 30 },
  { id: "shave",   name: "Luxury Shave", price: 350, duration: 45 },
  { id: "color",   name: "Hair Color",   price: 800, duration: 90 }
];

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function WalkInsView({ bookings, onReload }) {
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [priceOverride, setPriceOverride] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggle = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const computedPrice = selected.reduce((a, id) => a + (SERVICES.find((s) => s.id === id)?.price || 0), 0);
  const finalPrice = priceOverride !== "" ? Math.max(0, parseInt(priceOverride, 10) || 0) : computedPrice;
  const totalDuration = selected.reduce((a, id) => a + (SERVICES.find((s) => s.id === id)?.duration || 0), 0);

  const save = async () => {
    if (selected.length === 0) { setError("Select at least one service."); return; }
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const svcNames = selected.map((id) => SERVICES.find((s) => s.id === id)?.name).filter(Boolean);
      const { reference } = await createWalkIn({
        customer_name: name,
        customer_phone: phone,
        services: svcNames,
        total_price: finalPrice,
        total_duration: totalDuration
      });
      setSuccess(`Walk-in saved · #${reference}`);
      setSelected([]); setName(""); setPhone(""); setPriceOverride("");
      onReload && onReload();
      setTimeout(() => setSuccess(""), 4000);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const today = todayKey();
  const walkins = (bookings || []).filter(b => b.source === "walkin" && b.booking_date === today);

  return (
    <div data-testid="walkins-view" className="space-y-12">
      {/* Quick Add */}
      <section>
        <h2 className="serif text-4xl lg:text-5xl">
          <span className="text-white">Add </span>
          <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Walk-in</span>
        </h2>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s) => {
            const sel = selected.includes(s.id);
            return (
              <button
                key={s.id}
                data-testid={`walkin-svc-${s.id}`}
                onClick={() => toggle(s.id)}
                className="text-left p-6 transition-all duration-300"
                style={{
                  background: sel ? "#1c1c1c" : "#141414",
                  border: sel ? "1px solid var(--gold)" : "1px solid #2a2a2a",
                  boxShadow: sel ? "0 0 30px -10px rgba(201,168,76,0.45)" : "none"
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="serif text-xl text-white">{s.name}</div>
                  <div className="serif text-lg" style={{ color: "var(--gold)" }}>₹{s.price}</div>
                </div>
                <div className="mt-3 text-[0.6rem] tracking-[0.22em]" style={{ color: sel ? "var(--gold)" : "#555" }}>
                  {sel ? "✓ SELECTED" : "TAP TO SELECT"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <FocusField label="NAME (OPTIONAL)" value={name} onChange={setName} testId="walkin-name" />
          <FocusField label="PHONE (OPTIONAL)" value={phone} onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))} testId="walkin-phone" />
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6 items-end">
          <div>
            <div className="text-[0.65rem] tracking-[0.26em] text-white/45 mb-2">CALCULATED PRICE</div>
            <div className="serif text-3xl" style={{ color: "var(--gold)" }}>₹{computedPrice.toLocaleString("en-IN")}</div>
          </div>
          <FocusField
            label="CUSTOM PRICE (OPTIONAL)"
            value={priceOverride}
            onChange={(v) => setPriceOverride(v.replace(/\D/g, ""))}
            testId="walkin-price"
            placeholder={`${computedPrice}`}
          />
        </div>

        {error && (
          <div data-testid="walkin-error" className="mt-5 px-4 py-3 text-sm" style={{ color: "var(--gold)", border: "1px solid var(--gold)", background: "rgba(201,168,76,0.06)" }}>
            {error}
          </div>
        )}
        {success && (
          <div data-testid="walkin-success" className="mt-5 px-4 py-3 text-sm" style={{ color: "#5ED27A", border: "1px solid #5ED27A", background: "rgba(94,210,122,0.06)" }}>
            {success}
          </div>
        )}

        <button
          data-testid="save-walkin"
          disabled={saving || selected.length === 0}
          onClick={save}
          className="mt-8 w-full justify-center inline-flex items-center gap-2 py-4 text-[0.78rem] tracking-[0.22em] font-semibold transition-all duration-300"
          style={{
            background: saving ? "#3f7d50" : "#5ED27A",
            color: "#0a0a0a",
            border: "1px solid #5ED27A",
            opacity: (saving || selected.length === 0) ? 0.55 : 1,
            cursor: (saving || selected.length === 0) ? "not-allowed" : "pointer"
          }}
        >
          {saving ? "SAVING…" : `SAVE WALK-IN · ₹${finalPrice.toLocaleString("en-IN")}`}
        </button>
      </section>

      {/* Today's Walk-ins */}
      <section>
        <div className="flex items-center justify-between">
          <h3 className="serif text-2xl lg:text-3xl">
            <span className="text-white">Today&apos;s </span>
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Walk-ins</span>
          </h3>
          <div className="text-[0.65rem] tracking-[0.26em] text-white/45">{walkins.length} TOTAL</div>
        </div>

        <div className="mt-6 hidden md:block">
          <div className="overflow-x-auto" style={{ background: "#141414", border: "1px solid #1c1c1c" }}>
            <table className="w-full text-left">
              <thead>
                <tr>
                  {["REF", "NAME", "PHONE", "SERVICES", "TOTAL", "TIME", "STATUS"].map(h => (
                    <th key={h} className="px-5 py-4 text-[0.62rem] tracking-[0.22em]" style={{ color: "var(--gold)", borderBottom: "1px solid #1c1c1c", background: "#141414" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {walkins.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-14 text-center text-white/40 text-sm">No walk-ins yet today.</td></tr>
                )}
                {walkins.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #1c1c1c", animation: `walkRow 500ms cubic-bezier(0.25,0.46,0.45,0.94) ${i * 60}ms both` }}>
                    <td className="px-5 py-4 font-italic-serif text-sm" style={{ color: "var(--gold)" }}>#{r.booking_reference || `GS-${1000 + r.id}`}</td>
                    <td className="px-5 py-4 text-white text-sm">{r.customer_name || "Anonymous"}</td>
                    <td className="px-5 py-4 text-white/55 text-sm">{r.customer_phone || "—"}</td>
                    <td className="px-5 py-4 text-white/85 text-sm">{(r.services || []).join(", ")}</td>
                    <td className="px-5 py-4 serif text-sm" style={{ color: "var(--gold)" }}>₹{(r.total_price || 0).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-white text-sm">{r.booking_time}</td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-3 py-1.5 text-[0.62rem] tracking-[0.22em]" style={{ color: "var(--gold)", background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold)" }}>
                        WALK-IN
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 md:hidden space-y-3">
          {walkins.length === 0 && <div className="p-6 text-center text-white/40 text-sm" style={{ background: "#141414", border: "1px solid #1c1c1c" }}>No walk-ins yet today.</div>}
          {walkins.map((r, i) => (
            <div key={r.id} className="p-5" style={{ background: "#141414", border: "1px solid #1c1c1c", animation: `walkRow 500ms cubic-bezier(0.25,0.46,0.45,0.94) ${i * 80}ms both` }}>
              <div className="flex items-start justify-between">
                <span className="font-italic-serif text-sm" style={{ color: "var(--gold)" }}>#{r.booking_reference || `GS-${1000 + r.id}`}</span>
                <span className="inline-block px-3 py-1 text-[0.6rem] tracking-[0.22em]" style={{ color: "var(--gold)", background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold)" }}>WALK-IN</span>
              </div>
              <div className="mt-2 serif text-lg text-white">{r.customer_name || "Anonymous"}</div>
              <div className="text-white/55 text-sm">{r.customer_phone || "—"}</div>
              <div className="text-white/85 text-sm mt-2">{(r.services || []).join(", ")}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="serif text-lg" style={{ color: "var(--gold)" }}>₹{(r.total_price || 0).toLocaleString("en-IN")}</span>
                <span className="text-white text-sm">{r.booking_time}</span>
              </div>
            </div>
          ))}
        </div>

        <style>{`@keyframes walkRow { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </section>
    </div>
  );
}

function FocusField({ label, value, onChange, testId, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-[0.65rem] tracking-[0.28em] mb-2" style={{ color: "var(--gold)" }}>{label}</label>
      <div className="relative">
        <input
          data-testid={testId}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3 text-white outline-none placeholder:text-white/30"
          style={{ background: "#1a1a1a", border: "1px solid #1f1f1f" }}
        />
        <span style={{ position: "absolute", left: 0, bottom: 0, height: 2, background: "var(--gold)", width: focused ? "100%" : "0%", transition: "width 300ms cubic-bezier(0.25,0.46,0.45,0.94)" }} />
      </div>
    </div>
  );
}
