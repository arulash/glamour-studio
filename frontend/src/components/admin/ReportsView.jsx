import { useMemo, useState } from "react";

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const monthKey = (year, month) => `${year}-${String(month + 1).padStart(2, "0")}`;
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

export default function ReportsView({ bookings }) {
  const [tab, setTab] = useState("DAILY");

  return (
    <div data-testid="reports-view">
      <h2 className="serif text-4xl lg:text-5xl">
        <span className="text-white">Reports </span>
        <span className="font-italic-serif" style={{ color: "var(--gold)" }}>&amp; Insights</span>
      </h2>

      <div className="mt-6 flex gap-3">
        {["DAILY", "MONTHLY"].map(t => {
          const active = tab === t;
          return (
            <button
              key={t}
              data-testid={`report-tab-${t.toLowerCase()}`}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 text-[0.7rem] tracking-[0.22em]"
              style={{
                background: active ? "var(--gold)" : "transparent",
                color: active ? "#0a0a0a" : "var(--gold)",
                border: "1px solid var(--gold)",
                fontWeight: active ? 700 : 500,
                transition: "background 200ms cubic-bezier(0.25,0.46,0.45,0.94), color 200ms ease"
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {tab === "DAILY"   && <Daily   bookings={bookings} />}
        {tab === "MONTHLY" && <Monthly bookings={bookings} />}
      </div>
    </div>
  );
}

/* ============== DAILY ============== */
function Daily({ bookings }) {
  const today = todayKey();
  const todays = (bookings || []).filter(b => b.booking_date === today);

  const completedToday = todays.filter(b => b.status === "completed");
  const revenue = completedToday.reduce((a, b) => a + (b.total_price || 0), 0);
  const totalCustomers = todays.length;
  const walkIns = todays.filter(b => b.source === "walkin").length;
  const online = todays.filter(b => b.source !== "walkin").length;
  const noShows = todays.filter(b => b.status === "no_show").length;
  const noShowRate = totalCustomers > 0 ? Math.round((noShows / totalCustomers) * 100) : 0;

  // Services breakdown — count of each service across today's bookings
  const svcCounts = {};
  todays.forEach(b => (b.services || []).forEach(s => { svcCounts[s] = (svcCounts[s] || 0) + 1; }));
  const svcRows = Object.entries(svcCounts).sort((a, b) => b[1] - a[1]);
  const svcMax = Math.max(1, ...svcRows.map(r => r[1]));

  // Peak hours
  const hourCounts = Array(11).fill(0); // 9 AM - 7 PM = 11 hours
  todays.forEach(b => {
    const t = b.booking_time || "";
    const match = t.match(/^(\d{1,2}):/);
    const ampm = t.includes("PM") ? "PM" : "AM";
    if (!match) return;
    let h = parseInt(match[1], 10);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    const idx = h - 9;
    if (idx >= 0 && idx < hourCounts.length) hourCounts[idx]++;
  });
  const hourMax = Math.max(1, ...hourCounts);
  const hourLabels = Array.from({ length: 11 }, (_, i) => {
    const h = 9 + i;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}${ampm}`;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Metric label="Today's Revenue"      value={`₹${revenue.toLocaleString("en-IN")}`} />
        <Metric label="Total Customers Today" value={totalCustomers} />
        <Metric label="Walk-ins Today"       value={walkIns} />
        <Metric label="Online Bookings Today" value={online} />
        <Metric label="No Show Rate"          value={`${noShowRate}%`} />
      </div>

      <Section title="Services Breakdown" subtitle="Bookings per service · today">
        {svcRows.length === 0 ? (
          <Empty>No services booked today.</Empty>
        ) : (
          <div className="space-y-3">
            {svcRows.map(([s, n]) => (
              <div key={s} className="flex items-center gap-4">
                <div className="text-white/85 text-sm w-32 shrink-0">{s}</div>
                <div className="flex-1 h-4" style={{ background: "#141414", border: "1px solid #1c1c1c" }}>
                  <div style={{
                    width: `${(n / svcMax) * 100}%`,
                    height: "100%", background: "var(--gold)",
                    transition: "width 700ms cubic-bezier(0.25,0.46,0.45,0.94)"
                  }} />
                </div>
                <div className="text-sm w-10 text-right" style={{ color: "var(--gold)" }}>{n}</div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Peak Hours" subtitle="Bookings count per hour · today">
        <div className="flex items-end gap-2 h-40">
          {hourCounts.map((c, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: "100%" }}>
                <div style={{
                  width: "100%",
                  height: `${(c / hourMax) * 100}%`,
                  background: c > 0 ? "var(--gold)" : "#1c1c1c",
                  transition: "height 800ms cubic-bezier(0.25,0.46,0.45,0.94)",
                  minHeight: c > 0 ? 6 : 2
                }} />
              </div>
              <div className="text-[0.55rem] tracking-wider text-white/45">{hourLabels[i]}</div>
              <div className="text-[0.6rem]" style={{ color: c > 0 ? "var(--gold)" : "#444" }}>{c || ""}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ============== MONTHLY ============== */
function Monthly({ bookings }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const prefix = monthKey(year, month);
  const inMonth = (bookings || []).filter(b => (b.booking_date || "").startsWith(prefix));
  const dim = daysInMonth(year, month);

  const completed = inMonth.filter(b => b.status === "completed");
  const monthlyRevenue = completed.reduce((a, b) => a + (b.total_price || 0), 0);

  // Unique customers by phone (or name fallback)
  const phones = new Set();
  inMonth.forEach(b => phones.add((b.customer_phone || "").trim() || `n_${b.id}`));
  const totalCustomers = phones.size;

  // First time visitors: customers whose FIRST booking_date (across all-time bookings) falls in this month
  const firstByPhone = new Map();
  (bookings || []).forEach(b => {
    const key = (b.customer_phone || "").trim() || `n_${b.id}`;
    const d = b.booking_date || "9999";
    if (!firstByPhone.has(key) || d < firstByPhone.get(key)) firstByPhone.set(key, d);
  });
  let newCustomers = 0;
  phones.forEach(p => { if ((firstByPhone.get(p) || "").startsWith(prefix)) newCustomers++; });
  const returningCustomers = totalCustomers - newCustomers;

  // Revenue trend - per day in month
  const revPerDay = Array(dim).fill(0);
  completed.forEach(b => {
    const day = parseInt((b.booking_date || "").slice(8, 10), 10);
    if (day >= 1 && day <= dim) revPerDay[day - 1] += b.total_price || 0;
  });
  const revMax = Math.max(1, ...revPerDay);

  // Walk-in vs Online
  const walkCount = inMonth.filter(b => b.source === "walkin").length;
  const onlineCount = inMonth.filter(b => b.source !== "walkin").length;
  const splitTotal = walkCount + onlineCount;

  // Top 5 services by revenue
  const svcRevenue = {};
  completed.forEach(b => {
    const n = (b.services || []).length || 1;
    const per = (b.total_price || 0) / n;
    (b.services || []).forEach(s => { svcRevenue[s] = (svcRevenue[s] || 0) + per; });
  });
  const top5 = Object.entries(svcRevenue).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const noShowRate = inMonth.length > 0
    ? Math.round((inMonth.filter(b => b.status === "no_show").length / inMonth.length) * 100)
    : 0;

  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      {/* Month picker */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { const d = new Date(year, month - 1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); }}
          className="px-3 py-2 text-sm"
          style={{ color: "var(--gold)", border: "1px solid #2a2a2a", background: "transparent" }}
        >‹</button>
        <div className="serif text-xl text-white min-w-[180px] text-center">{monthName}</div>
        <button
          onClick={() => { const d = new Date(year, month + 1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); }}
          className="px-3 py-2 text-sm"
          style={{ color: "var(--gold)", border: "1px solid #2a2a2a", background: "transparent" }}
        >›</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Monthly Revenue"      value={`₹${monthlyRevenue.toLocaleString("en-IN")}`} />
        <Metric label="Total Customers"      value={totalCustomers} />
        <Metric label="New Customers"        value={newCustomers} />
        <Metric label="Returning Customers"  value={returningCustomers} />
      </div>

      <Section title="Revenue Trend" subtitle={`Daily revenue · ${monthName}`}>
        <RevenueLine values={revPerDay} max={revMax} />
      </Section>

      <div className="grid lg:grid-cols-2 gap-4">
        <Section title="Walk-in vs Online" subtitle="Source split">
          {splitTotal === 0 ? (
            <Empty>No bookings this month.</Empty>
          ) : (
            <Donut walk={walkCount} online={onlineCount} />
          )}
        </Section>

        <Section title="Top 5 Services" subtitle="By revenue this month">
          {top5.length === 0 ? (
            <Empty>No completed services.</Empty>
          ) : (
            <div className="space-y-3">
              {top5.map(([name, rev], i) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="serif text-lg" style={{ color: "var(--gold)" }}>{i + 1}.</div>
                  <div className="flex-1 text-white text-sm">{name}</div>
                  <div className="serif text-sm" style={{ color: "var(--gold)" }}>₹{Math.round(rev).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <Section title="No Show Rate" subtitle={`Across all ${inMonth.length} bookings`}>
        <div className="flex items-center gap-6">
          <div className="serif text-6xl" style={{ color: "var(--gold)" }}>{noShowRate}%</div>
          <div className="text-white/55 text-sm max-w-md">{inMonth.filter(b => b.status === "no_show").length} no-shows out of {inMonth.length} bookings.</div>
        </div>
      </Section>
    </div>
  );
}

/* ---------- Reusable bits ---------- */
function Metric({ label, value }) {
  return (
    <div className="p-6" style={{ background: "#141414", border: "1px solid #1c1c1c" }}>
      <div className="serif text-3xl lg:text-4xl" style={{ color: "var(--gold)" }}>{value}</div>
      <div className="mt-2 text-[0.6rem] tracking-[0.26em] text-white/50 uppercase">{label}</div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="p-7" style={{ background: "#141414", border: "1px solid #1c1c1c" }}>
      <div className="flex items-end justify-between flex-wrap gap-2">
        <h3 className="serif text-2xl text-white">{title}</h3>
        {subtitle && <div className="text-[0.62rem] tracking-[0.22em] text-white/40 uppercase">{subtitle}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Empty({ children }) { return <div className="text-white/40 text-sm py-6 text-center">{children}</div>; }

function RevenueLine({ values, max }) {
  if (!values.length) return null;
  const w = 800, h = 180, pad = 30;
  const stepX = (w - pad * 2) / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y];
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L ${points[points.length - 1][0]} ${h - pad} L ${points[0][0]} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" style={{ height: 180 }}>
      <defs>
        <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#goldArea)" />
      <path d={path} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="var(--gold)" />
      ))}
      {[1, Math.floor(values.length / 2), values.length].map((d) => {
        const i = d - 1;
        if (i < 0 || i >= values.length) return null;
        return (
          <text key={d} x={pad + i * stepX} y={h - 10} fontSize="9" fill="#666" textAnchor="middle">{d}</text>
        );
      })}
    </svg>
  );
}

function Donut({ walk, online }) {
  const total = walk + online;
  const walkPct = total > 0 ? (walk / total) : 0;
  const r = 60, c = 2 * Math.PI * r;
  const walkLen = c * walkPct;

  return (
    <div className="flex items-center gap-8 flex-wrap">
      <svg viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#1f1f1f" strokeWidth="18" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke="var(--gold)" strokeWidth="18"
          strokeDasharray={`${walkLen} ${c}`}
          transform="rotate(-90 80 80)"
          style={{ transition: "stroke-dasharray 800ms cubic-bezier(0.25,0.46,0.45,0.94)" }}
        />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke="#b8b8b8" strokeWidth="18"
          strokeDasharray={`${c - walkLen} ${c}`}
          strokeDashoffset={-walkLen}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span style={{ width: 12, height: 12, background: "var(--gold)" }} />
          <span className="text-white text-sm">Walk-ins</span>
          <span className="serif" style={{ color: "var(--gold)" }}>{walk}</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ width: 12, height: 12, background: "#b8b8b8" }} />
          <span className="text-white text-sm">Online</span>
          <span className="serif text-white">{online}</span>
        </div>
      </div>
    </div>
  );
}
