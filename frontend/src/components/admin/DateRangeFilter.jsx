import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

const pad = (n) => String(n).padStart(2, "0");
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

export const presetRange = (preset) => {
  const today = startOfDay(new Date());
  switch (preset) {
    case "today":     return { from: toKey(today), to: toKey(today), label: "Today" };
    case "yesterday": { const y = addDays(today, -1); return { from: toKey(y), to: toKey(y), label: "Yesterday" }; }
    case "7d":        return { from: toKey(addDays(today, -6)), to: toKey(today), label: "Last 7 Days" };
    case "30d":       return { from: toKey(addDays(today, -29)), to: toKey(today), label: "Last 30 Days" };
    case "month":     { const first = new Date(today.getFullYear(), today.getMonth(), 1); return { from: toKey(first), to: toKey(today), label: "This Month" }; }
    case "all":       return { from: "1970-01-01", to: "9999-12-31", label: "All Time" };
    default:          return { from: toKey(today), to: toKey(today), label: "Today" };
  }
};

const fmtPretty = (key) => {
  if (!key || key === "1970-01-01" || key === "9999-12-31") return "—";
  const d = new Date(key + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function DateRangeFilter({ value, onChange, testIdPrefix = "date" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const label = value.label || (value.from === value.to ? fmtPretty(value.from) : `${fmtPretty(value.from)} → ${fmtPretty(value.to)}`);

  const pick = (preset) => { onChange(presetRange(preset)); setOpen(false); };
  const setCustom = (key, val) => onChange({ ...value, [key]: val, label: null });

  return (
    <div ref={wrapRef} className="relative inline-block" style={{ zIndex: 9999 }} data-testid={`${testIdPrefix}-filter`}>
      <button
        data-testid={`${testIdPrefix}-trigger`}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 px-4 py-2.5 text-sm"
        style={{
          background: "#141414",
          border: "1px solid #2a2a2a",
          color: "var(--gold)",
          transition: "border-color 200ms ease"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
      >
        <Calendar size={14} />
        <span className="text-white">{label}</span>
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }} />
      </button>

      {open && (
        <div
          data-testid={`${testIdPrefix}-panel`}
          className="absolute z-40 mt-2 right-0 w-[320px] p-5"
          style={{
            background: "#0d0d0d",
            border: "1px solid var(--gold)",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
            animation: "drFade 200ms cubic-bezier(0.25,0.46,0.45,0.94)"
          }}
        >
          <div className="text-[0.62rem] tracking-[0.28em]" style={{ color: "var(--gold)" }}>QUICK SELECT</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["today",     "Today"],
              ["yesterday", "Yesterday"],
              ["7d",        "Last 7 Days"],
              ["30d",       "Last 30 Days"],
              ["month",     "This Month"],
              ["all",       "All Time"]
            ].map(([k, lbl]) => {
              const active = value.label === lbl;
              return (
                <button
                  key={k}
                  data-testid={`${testIdPrefix}-preset-${k}`}
                  onClick={() => pick(k)}
                  className="px-3 py-2 text-xs tracking-wider text-left transition-colors duration-200"
                  style={{
                    background: active ? "rgba(201,168,76,0.12)" : "transparent",
                    border: `1px solid ${active ? "var(--gold)" : "#2a2a2a"}`,
                    color: active ? "var(--gold)" : "#d8d8d8"
                  }}
                >
                  {lbl}
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t" style={{ borderColor: "#1c1c1c" }}>
            <div className="text-[0.62rem] tracking-[0.28em]" style={{ color: "var(--gold)" }}>CUSTOM RANGE</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="text-[0.58rem] tracking-[0.22em] text-white/40 mb-1">FROM</div>
                <input
                  data-testid={`${testIdPrefix}-from`}
                  type="date"
                  value={value.from === "1970-01-01" ? "" : value.from}
                  onChange={(e) => setCustom("from", e.target.value || "1970-01-01")}
                  className="w-full px-2 py-2 text-xs text-white"
                  style={{ background: "#141414", border: "1px solid #2a2a2a", colorScheme: "dark" }}
                />
              </div>
              <div>
                <div className="text-[0.58rem] tracking-[0.22em] text-white/40 mb-1">TO</div>
                <input
                  data-testid={`${testIdPrefix}-to`}
                  type="date"
                  value={value.to === "9999-12-31" ? "" : value.to}
                  onChange={(e) => setCustom("to", e.target.value || "9999-12-31")}
                  className="w-full px-2 py-2 text-xs text-white"
                  style={{ background: "#141414", border: "1px solid #2a2a2a", colorScheme: "dark" }}
                />
              </div>
            </div>
            <button
              data-testid={`${testIdPrefix}-apply`}
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 text-[0.65rem] tracking-[0.26em] font-semibold"
              style={{ background: "var(--gold)", color: "#0a0a0a" }}
            >
              APPLY
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes drFade { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

/** Returns true if booking_date (YYYY-MM-DD) falls inside the range (inclusive). */
export const inRange = (dateKey, range) => {
  if (!dateKey) return false;
  return dateKey >= range.from && dateKey <= range.to;
};
