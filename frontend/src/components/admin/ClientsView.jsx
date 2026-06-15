import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

const fmtDate = (s) => {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

const StatusPill = ({ status }) => {
  const map = {
    pending:   { label: "PENDING",   color: "var(--gold)" },
    completed: { label: "COMPLETED", color: "#5ED27A"     },
    no_show:   { label: "NO SHOW",   color: "#E5685E"     }
  };
  const s = map[status] || map.pending;
  return (
    <span className="inline-block px-2.5 py-1 text-[0.58rem] tracking-[0.22em]" style={{ color: s.color, border: `1px solid ${s.color}`, background: `${s.color}1a` }}>
      {s.label}
    </span>
  );
};

export default function ClientsView({ bookings }) {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [openClient, setOpenClient] = useState(null);

  const clients = useMemo(() => {
    const map = new Map();
    (bookings || []).forEach(b => {
      const phone = (b.customer_phone || "").trim();
      const key = phone || `noPhone-${(b.customer_name || "").toLowerCase()}-${b.id}`;
      const prev = map.get(key) || {
        key,
        name: b.customer_name || "Anonymous",
        phone: phone || "—",
        visits: 0,
        lastVisit: null,
        lifetime: 0,
        services: {},
        bookings: []
      };
      prev.visits += 1;
      prev.lifetime += b.total_price || 0;
      if (!prev.lastVisit || (b.booking_date || "") > prev.lastVisit) {
        prev.lastVisit = b.booking_date;
        prev.name = b.customer_name || prev.name;
      }
      (b.services || []).forEach(s => { prev.services[s] = (prev.services[s] || 0) + 1; });
      prev.bookings.push(b);
      map.set(key, prev);
    });
    return Array.from(map.values()).map(c => {
      let fav = "—", favCount = 0;
      Object.entries(c.services).forEach(([s, n]) => { if (n > favCount) { fav = s; favCount = n; } });
      return { ...c, favourite: fav };
    });
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? clients.filter(c => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q))
      : clients;
    return [...list].sort((a, b) => (b.lastVisit || "").localeCompare(a.lastVisit || ""));
  }, [clients, search]);

  return (
    <div data-testid="clients-view">
      <h2 className="serif text-4xl lg:text-5xl">
        <span className="text-white">All </span>
        <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Clients</span>
      </h2>

      <div className="mt-6 relative max-w-md">
        <Search size={15} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ color: "var(--gold)" }} />
        <input
          data-testid="clients-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search by name or phone..."
          className="w-full bg-transparent text-white outline-none pl-7 py-3 placeholder:text-white/30"
          style={{ borderBottom: "1px solid #2a2a2a" }}
        />
        <span style={{ position: "absolute", left: 0, bottom: 0, height: 1, background: "var(--gold)", width: focused ? "100%" : "0%", transition: "width 300ms cubic-bezier(0.25,0.46,0.45,0.94)" }} />
      </div>

      <div className="mt-8 hidden md:block">
        <div className="overflow-x-auto" style={{ background: "#141414", border: "1px solid #1c1c1c" }}>
          <table className="w-full text-left">
            <thead>
              <tr>
                {["NAME", "PHONE", "TOTAL VISITS", "LAST VISIT", "LIFETIME SPEND", "FAVOURITE SERVICE"].map(h => (
                  <th key={h} className="px-5 py-4 text-[0.62rem] tracking-[0.22em]" style={{ color: "var(--gold)", borderBottom: "1px solid #1c1c1c", background: "#141414" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-14 text-center text-white/40 text-sm">No clients found.</td></tr>
              )}
              {filtered.map((c, i) => (
                <tr
                  key={c.key}
                  data-testid={`client-row-${i}`}
                  onClick={() => setOpenClient(c)}
                  style={{ borderBottom: "1px solid #1c1c1c", cursor: "pointer", animation: `cliRow 500ms cubic-bezier(0.25,0.46,0.45,0.94) ${i * 50}ms both` }}
                  className="hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4 text-white text-sm">{c.name}</td>
                  <td className="px-5 py-4 text-white/55 text-sm">{c.phone}</td>
                  <td className="px-5 py-4 text-white/85 text-sm">{c.visits}</td>
                  <td className="px-5 py-4 text-white/75 text-sm">{fmtDate(c.lastVisit)}</td>
                  <td className="px-5 py-4 serif text-sm" style={{ color: "var(--gold)" }}>₹{c.lifetime.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4 text-white/85 text-sm">{c.favourite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 md:hidden space-y-3">
        {filtered.length === 0 && <div className="p-6 text-center text-white/40 text-sm" style={{ background: "#141414", border: "1px solid #1c1c1c" }}>No clients found.</div>}
        {filtered.map((c, i) => (
          <button
            key={c.key}
            onClick={() => setOpenClient(c)}
            className="w-full text-left p-5"
            style={{ background: "#141414", border: "1px solid #1c1c1c", animation: `cliRow 500ms cubic-bezier(0.25,0.46,0.45,0.94) ${i * 60}ms both` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="serif text-lg text-white">{c.name}</div>
                <div className="text-white/55 text-sm">{c.phone}</div>
              </div>
              <div className="serif text-base" style={{ color: "var(--gold)" }}>₹{c.lifetime.toLocaleString("en-IN")}</div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div><div className="text-white/40 text-[0.6rem] tracking-[0.22em]">VISITS</div><div className="text-white mt-0.5">{c.visits}</div></div>
              <div><div className="text-white/40 text-[0.6rem] tracking-[0.22em]">LAST</div><div className="text-white/85 mt-0.5">{fmtDate(c.lastVisit)}</div></div>
              <div><div className="text-white/40 text-[0.6rem] tracking-[0.22em]">FAV</div><div className="text-white/85 mt-0.5">{c.favourite}</div></div>
            </div>
          </button>
        ))}
      </div>

      <ClientPanel client={openClient} onClose={() => setOpenClient(null)} />

      <style>{`@keyframes cliRow { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

function ClientPanel({ client, onClose }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(!!client), 10);
    return () => clearTimeout(t);
  }, [client]);

  if (!client) return null;

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 350);
  };

  const sorted = [...client.bookings].sort((a, b) => (b.booking_date || "").localeCompare(a.booking_date || ""));

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          opacity: open ? 1 : 0, transition: "opacity 350ms ease", zIndex: 60
        }}
      />
      <aside
        data-testid="client-panel"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(520px, 100%)",
          background: "#0d0d0d",
          borderLeft: "1px solid var(--gold)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 400ms cubic-bezier(0.25,0.46,0.45,0.94)",
          zIndex: 70, overflowY: "auto"
        }}
      >
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[0.62rem] tracking-[0.28em]" style={{ color: "var(--gold)" }}>CLIENT</div>
              <h3 className="serif text-3xl mt-2 text-white">{client.name}</h3>
              <div className="text-white/55 text-sm mt-1">{client.phone}</div>
            </div>
            <button data-testid="client-panel-close" onClick={handleClose} className="text-white/60 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            <Tile label="VISITS"   value={client.visits} />
            <Tile label="LIFETIME" value={`₹${client.lifetime.toLocaleString("en-IN")}`} />
            <Tile label="FAVOURITE" value={client.favourite} small />
          </div>

          <div className="mt-9">
            <div className="text-[0.62rem] tracking-[0.28em]" style={{ color: "var(--gold)" }}>VISIT HISTORY</div>
            <div className="mt-4 space-y-3">
              {sorted.map((b) => (
                <div key={b.id} className="p-4" style={{ background: "#141414", border: "1px solid #1c1c1c" }}>
                  <div className="flex items-center justify-between">
                    <div className="font-italic-serif text-xs" style={{ color: "var(--gold)" }}>#{b.booking_reference || `GS-${1000 + b.id}`}</div>
                    <StatusPill status={b.status} />
                  </div>
                  <div className="mt-2 text-white/85 text-sm">{(b.services || []).join(", ")}</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-white/65">{fmtDate(b.booking_date)} · {b.booking_time}</span>
                    <span className="serif" style={{ color: "var(--gold)" }}>₹{(b.total_price || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Tile({ label, value, small }) {
  return (
    <div className="p-3" style={{ background: "#141414", border: "1px solid #1c1c1c" }}>
      <div className="text-[0.58rem] tracking-[0.22em] text-white/45">{label}</div>
      <div className={`mt-1 serif ${small ? "text-sm" : "text-xl"}`} style={{ color: "var(--gold)" }}>{value}</div>
    </div>
  );
}
