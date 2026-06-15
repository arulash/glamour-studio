import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Search } from "lucide-react";
import { fetchAllBookings, updateBookingStatus } from "@/lib/supabase";
import WalkInsView from "@/components/admin/WalkInsView";
import ClientsView from "@/components/admin/ClientsView";
import ReportsView from "@/components/admin/ReportsView";

const STAFF_USER = "staff_glamour";
const STAFF_PASS = "glamour@123";
const SESSION_KEY = "glamour_admin_session";

/* ---------------- Count up hook ---------------- */
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/* ---------------- Reveal hook (no animation libs) ---------------- */
function useStagger(delay) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return shown;
}

const fadeStyle = (shown, extraDelay = 0) => ({
  opacity: shown ? 1 : 0,
  transform: shown ? "translateY(0)" : "translateY(30px)",
  transition: `opacity 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${extraDelay}ms, transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${extraDelay}ms`
});

/* =================== PAGE =================== */
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SESSION_KEY) === "1";
  });
  const [exiting, setExiting] = useState(false);

  const handleLogin = () => {
    setExiting(true);
    setTimeout(() => {
      localStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setExiting(false);
    }, 400);
  };

  const handleLogout = () => {
    setExiting(true);
    setTimeout(() => {
      localStorage.removeItem(SESSION_KEY);
      setAuthed(false);
      setExiting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black" data-testid="admin-page">
      {authed
        ? <Dashboard onLogout={handleLogout} exiting={exiting} />
        : <Login onSuccess={handleLogin} exiting={exiting} />}
    </div>
  );
}

/* =================== LOGIN =================== */
function Login({ onSuccess, exiting }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cardShown = useStagger(80);
  const linesShown = useStagger(300);
  const subShown = useStagger(500);
  const userShown = useStagger(650);
  const passShown = useStagger(750);
  const btnShown = useStagger(850);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username.trim() === STAFF_USER && password === STAFF_PASS) {
        setLoading(false);
        onSuccess();
      } else {
        setLoading(false);
        setError("Invalid credentials. Please try again.");
      }
    }, 520);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" data-testid="admin-login">
      <div
        className="w-full max-w-md p-10 lg:p-12"
        style={{
          background: "#0f0f0f",
          border: "1px solid #1f1f1f",
          ...fadeStyle(cardShown && !exiting),
          ...(exiting ? { opacity: 0, transform: "translateY(-30px)", transition: "all 400ms cubic-bezier(0.25,0.46,0.45,0.94)" } : {})
        }}
      >
        {/* Heading with side lines */}
        <div className="flex items-center justify-center gap-4">
          <span
            style={{
              height: 1, background: "var(--gold)",
              width: linesShown ? 40 : 0,
              transition: "width 600ms cubic-bezier(0.25,0.46,0.45,0.94)"
            }}
          />
          <h1 className="serif text-3xl lg:text-4xl tracking-wide">
            <span className="text-white">Glamour</span>{" "}
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Studio</span>
          </h1>
          <span
            style={{
              height: 1, background: "var(--gold)",
              width: linesShown ? 40 : 0,
              transition: "width 600ms cubic-bezier(0.25,0.46,0.45,0.94)"
            }}
          />
        </div>

        <p
          className="text-center text-white/50 text-sm tracking-wider mt-4"
          style={fadeStyle(subShown)}
        >
          Staff Access Only
        </p>

        <form onSubmit={submit} className="mt-10 space-y-7" data-testid="admin-login-form">
          <FocusField
            label="USERNAME"
            value={username}
            onChange={setUsername}
            shown={userShown}
            testId="admin-username"
          />
          <FocusField
            label="PASSWORD"
            type="password"
            value={password}
            onChange={setPassword}
            shown={passShown}
            testId="admin-password"
          />

          {/* Error */}
          <div
            style={{
              maxHeight: error ? 80 : 0,
              opacity: error ? 1 : 0,
              transform: error ? "translateY(0)" : "translateY(-8px)",
              overflow: "hidden",
              transition: "all 300ms ease"
            }}
          >
            <div
              data-testid="admin-login-error"
              className="px-4 py-3 text-xs tracking-wider"
              style={{
                color: "var(--gold)",
                border: "1px solid var(--gold)",
                background: "rgba(201,168,76,0.06)"
              }}
            >
              {error || " "}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="btn-gold w-full justify-center"
            style={{
              ...fadeStyle(btnShown, 0),
              animation: loading ? "loginPulse 500ms ease-in-out infinite" : "none"
            }}
          >
            {loading ? "AUTHORISING…" : "LOGIN"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes loginPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.55); }
          50% { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
        }
      `}</style>
    </div>
  );
}

function FocusField({ label, value, onChange, type = "text", shown, testId }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={fadeStyle(shown)}>
      <label className="block text-[0.65rem] tracking-[0.28em] mb-2" style={{ color: "var(--gold)" }}>
        {label}
      </label>
      <div className="relative">
        <input
          data-testid={testId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3 text-white outline-none"
          style={{
            background: "#1a1a1a",
            border: "1px solid #1f1f1f",
            transition: "border-color 200ms ease"
          }}
        />
        {/* gold bottom border that slides in from left */}
        <span
          style={{
            position: "absolute",
            left: 0, bottom: 0,
            height: 2,
            background: "var(--gold)",
            width: focused ? "100%" : "0%",
            transition: "width 300ms cubic-bezier(0.25,0.46,0.45,0.94)"
          }}
        />
      </div>
    </div>
  );
}

/* =================== DASHBOARD =================== */
function Dashboard({ onLogout, exiting }) {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [tableKey, setTableKey] = useState(0); // bumps to re-trigger fade
  const [pageShown, setPageShown] = useState(false);
  const [view, setView] = useState("BOOKINGS");
  const initialMount = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setPageShown(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Data loading: deferred via setTimeout to keep effect side-effect free
  const reload = () => {
    fetchAllBookings().then(data => setBookings(data));
  };
  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await fetchAllBookings();
      if (active) setBookings(data);
    };
    setTimeout(load, 0);
    const id = setInterval(load, 30000);
    return () => { active = false; clearInterval(id); };
  }, []);

  // Re-trigger table fade animation on filter / search change
  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    setTimeout(() => setTableKey(k => k + 1), 0);
  }, [filter, search]);

  /* Stats */
  const todayKey = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  const stats = useMemo(() => ({
    today: bookings.filter(b => b.booking_date === todayKey).length,
    pending: bookings.filter(b => b.status === "pending").length,
    completed: bookings.filter(b => b.status === "completed").length,
    noShow: bookings.filter(b => b.status === "no_show").length,
    revenue: bookings
      .filter(b => b.booking_date === todayKey && b.status === "completed")
      .reduce((a, b) => a + (b.total_price || 0), 0)
  }), [bookings, todayKey]);

  /* Filter + search */
  const filtered = useMemo(() => {
    let list = bookings;
    if (filter === "TODAY")     list = list.filter(b => b.booking_date === todayKey);
    if (filter === "PENDING")   list = list.filter(b => b.status === "pending");
    if (filter === "COMPLETED") list = list.filter(b => b.status === "completed");
    if (filter === "NO SHOW")   list = list.filter(b => b.status === "no_show");
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(b =>
        (b.customer_name || "").toLowerCase().includes(q) ||
        (b.customer_phone || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, filter, search, todayKey]);

  /* Optimistic status update */
  const setStatus = async (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status, _justUpdated: true } : b));
    try {
      await updateBookingStatus(id, status);
    } catch (e) {
      console.error("updateBookingStatus failed", e);
      // revert
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "pending", _justUpdated: false } : b));
    }
  };

  /* Stagger reveals */
  const navShown    = useStagger(80);
  const statsShown  = useStagger(200);
  const tabsShown   = useStagger(450);
  const searchShown = useStagger(600);
  const tableShown  = useStagger(750);

  const exitStyle = exiting
    ? { opacity: 0, transform: "translateY(-30px)", transition: "all 400ms cubic-bezier(0.25,0.46,0.45,0.94)" }
    : {};

  return (
    <div
      data-testid="admin-dashboard"
      style={{
        opacity: pageShown ? 1 : 0,
        transition: "opacity 500ms ease",
        ...exitStyle
      }}
    >
      {/* Navbar */}
      <header
        style={{
          background: "#0d0d0d",
          borderBottom: "1px solid #1c1c1c",
          ...fadeStyle(navShown)
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="serif text-xl tracking-wide shrink-0">
            <span className="text-white">Glamour</span>{" "}
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Studio</span>
          </div>

          <div className="hidden lg:flex items-center text-[0.65rem] tracking-[0.3em] uppercase">
            {["BOOKINGS", "WALK-INS", "CLIENTS", "REPORTS"].map((t, i) => {
              const active = view === t;
              return (
                <button
                  key={t}
                  data-testid={`admin-nav-${t.toLowerCase().replace(/[^a-z]/g, "")}`}
                  onClick={() => setView(t)}
                  className="px-3 transition-colors duration-200"
                  style={{
                    color: active ? "var(--gold)" : "rgba(201,168,76,0.55)",
                    fontWeight: active ? 700 : 500,
                    position: "relative"
                  }}
                >
                  {t}
                  <span
                    style={{
                      position: "absolute", left: 12, right: 12, bottom: -22,
                      height: 2, background: "var(--gold)",
                      transform: active ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 300ms cubic-bezier(0.25,0.46,0.45,0.94)"
                    }}
                  />
                </button>
              );
            })}
          </div>

          <button
            data-testid="admin-logout"
            onClick={onLogout}
            className="btn-outline-gold btn-sm shrink-0"
          >
            <LogOut size={13} /> LOGOUT
          </button>

          {/* Mobile nav row */}
          <div className="lg:hidden basis-full flex items-center gap-1 overflow-x-auto no-scrollbar -mb-1 text-[0.62rem] tracking-[0.26em] uppercase">
            {["BOOKINGS", "WALK-INS", "CLIENTS", "REPORTS"].map((t) => {
              const active = view === t;
              return (
                <button
                  key={t}
                  data-testid={`admin-nav-m-${t.toLowerCase().replace(/[^a-z]/g, "")}`}
                  onClick={() => setView(t)}
                  className="px-3 py-2 whitespace-nowrap"
                  style={{
                    color: active ? "var(--gold)" : "rgba(201,168,76,0.55)",
                    fontWeight: active ? 700 : 500,
                    borderBottom: active ? "2px solid var(--gold)" : "2px solid transparent"
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        {view === "BOOKINGS" && (
          <BookingsSection
            bookings={bookings}
            stats={stats}
            filter={filter} setFilter={setFilter}
            search={search} setSearch={setSearch}
            filtered={filtered}
            tableKey={tableKey}
            setStatus={setStatus}
            statsShown={statsShown}
            tabsShown={tabsShown}
            searchShown={searchShown}
            tableShown={tableShown}
          />
        )}
        {view === "WALK-INS" && <WalkInsView bookings={bookings} onReload={reload} />}
        {view === "CLIENTS"  && <ClientsView bookings={bookings} />}
        {view === "REPORTS"  && <ReportsView bookings={bookings} />}
      </main>
    </div>
  );
}

function BookingsSection({ bookings, stats, filter, setFilter, search, setSearch, filtered, tableKey, setStatus, statsShown, tabsShown, searchShown, tableShown }) {
  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5" data-testid="admin-stats">
        <StatCard label="Today's Bookings" value={stats.today}     delay={0}   shown={statsShown} testId="stat-today" />
        <StatCard label="Pending"          value={stats.pending}   delay={100} shown={statsShown} testId="stat-pending" />
        <StatCard label="Completed"        value={stats.completed} delay={200} shown={statsShown} testId="stat-completed" />
        <StatCard label="No Shows"         value={stats.noShow}    delay={300} shown={statsShown} testId="stat-noshow" />
        <StatCard label="Today's Revenue"  value={stats.revenue}   delay={400} shown={statsShown} testId="stat-revenue" prefix="₹" />
      </div>

      {/* Filter Tabs */}
      <div
        className="mt-12 flex flex-wrap gap-3"
        style={fadeStyle(tabsShown)}
        data-testid="admin-filter-tabs"
      >
        {["ALL", "TODAY", "PENDING", "COMPLETED", "NO SHOW"].map(t => {
          const active = filter === t;
          return (
            <button
              key={t}
              data-testid={`filter-${t.replace(/ /g, "-").toLowerCase()}`}
              onClick={() => setFilter(t)}
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

      {/* Search */}
      <div className="mt-8" style={fadeStyle(searchShown)}>
        <SearchField value={search} onChange={setSearch} />
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      <div className="mt-8" style={fadeStyle(tableShown)}>
        <DesktopTable key={`d-${tableKey}`} rows={filtered} onStatus={setStatus} />
        <MobileCards key={`m-${tableKey}`} rows={filtered} onStatus={setStatus} />
      </div>
    </>
  );
}

/* ---------------- Stat Card ---------------- */
function StatCard({ label, value, delay, shown, testId, prefix = "" }) {
  const count = useCountUp(value);
  const [labelShown, setLabelShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLabelShown(true), 700);
    return () => clearTimeout(t);
  }, []);

  const display = prefix
    ? `${prefix}${count.toLocaleString("en-IN")}`
    : count;

  return (
    <div
      data-testid={testId}
      className="p-7 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--bg-3)",
        border: "1px solid #2a2a2a",
        ...fadeStyle(shown, delay)
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--gold)";
        e.currentTarget.style.boxShadow = "0 0 40px -10px rgba(201,168,76,0.35)";
        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2a2a2a";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }}
    >
      <div className="serif text-4xl lg:text-5xl" style={{ color: "var(--gold)" }} data-testid={`${testId}-value`}>
        {display}
      </div>
      <div
        className="mt-3 text-[0.7rem] tracking-[0.26em] uppercase text-white/55"
        style={{ opacity: labelShown ? 1 : 0, transition: "opacity 400ms ease" }}
      >
        {label}
      </div>
    </div>
  );
}

/* ---------------- Search ---------------- */
function SearchField({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative max-w-md">
      <Search size={15} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ color: "var(--gold)" }} />
      <input
        data-testid="admin-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search by name or phone..."
        className="w-full bg-transparent text-white outline-none pl-7 py-3 placeholder:text-white/30"
        style={{ borderBottom: "1px solid #2a2a2a" }}
      />
      <span
        style={{
          position: "absolute", left: 0, bottom: 0,
          height: 1, background: "var(--gold)",
          width: focused ? "100%" : "0%",
          transition: "width 300ms cubic-bezier(0.25,0.46,0.45,0.94)"
        }}
      />
    </div>
  );
}

/* ---------------- Status Pill ---------------- */
function StatusPill({ status }) {
  const map = {
    pending:   { label: "PENDING",   color: "var(--gold)",  bg: "rgba(201,168,76,0.1)"  },
    completed: { label: "COMPLETED", color: "#5ED27A",       bg: "rgba(94,210,122,0.1)"  },
    no_show:   { label: "NO SHOW",   color: "#E5685E",       bg: "rgba(229,104,94,0.1)"  }
  };
  const s = map[status] || map.pending;
  return (
    <span
      className="inline-block px-3 py-1.5 text-[0.62rem] tracking-[0.22em]"
      style={{
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}`,
        transition: "color 400ms ease, background 400ms ease, border-color 400ms ease"
      }}
    >
      {s.label}
    </span>
  );
}

/* ---------------- Action Buttons ---------------- */
function ActionButtons({ row, onStatus }) {
  const [busy, setBusy] = useState(null); // 'completed' | 'no_show'
  const [hide, setHide] = useState(false);

  if (row.status !== "pending" || hide) return null;

  const handle = (status) => {
    setBusy(status);
    setTimeout(async () => {
      await onStatus(row.id, status);
      setBusy(null);
      // fade out buttons
      setTimeout(() => setHide(true), 300);
    }, 300);
  };

  const btnBase = "px-3 py-1.5 text-[0.62rem] tracking-[0.22em] transition-all duration-200";

  return (
    <div className="flex gap-2" style={{ opacity: hide ? 0 : 1, transition: "opacity 300ms ease" }}>
      <button
        data-testid={`complete-${row.id}`}
        onClick={() => handle("completed")}
        disabled={!!busy}
        className={btnBase}
        style={{
          color: "#5ED27A",
          border: "1px solid #5ED27A",
          background: "transparent",
          animation: busy === "completed" ? "btnPulse 300ms ease" : "none"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#5ED27A"; e.currentTarget.style.color = "#0a0a0a"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5ED27A"; }}
      >
        COMPLETE
      </button>
      <button
        data-testid={`noshow-${row.id}`}
        onClick={() => handle("no_show")}
        disabled={!!busy}
        className={btnBase}
        style={{
          color: "#E5685E",
          border: "1px solid #E5685E",
          background: "transparent",
          animation: busy === "no_show" ? "btnPulse 300ms ease" : "none"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#E5685E"; e.currentTarget.style.color = "#0a0a0a"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#E5685E"; }}
      >
        NO SHOW
      </button>
      <style>{`@keyframes btnPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); opacity: 0.85; } }`}</style>
    </div>
  );
}

/* ---------------- Helpers ---------------- */
const fmtDate = (s) => {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

/* ---------------- Desktop Table ---------------- */
function DesktopTable({ rows, onStatus }) {
  return (
    <div className="hidden md:block" data-testid="admin-table">
      <div className="card-dark overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              {["REF", "NAME", "PHONE", "SERVICES", "DATE", "TIME", "TOTAL", "STATUS", "ACTIONS"].map(h => (
                <th
                  key={h}
                  className="px-5 py-4 text-[0.62rem] tracking-[0.22em]"
                  style={{ color: "var(--gold)", borderBottom: "1px solid #1c1c1c", background: "#141414" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={9} className="px-5 py-16 text-center text-white/40 text-sm">No bookings found.</td></tr>
            )}
            {rows.map((r, i) => (
              <tr
                key={r.id}
                data-testid={`row-${r.id}`}
                style={{
                  borderBottom: "1px solid #1c1c1c",
                  animation: `rowIn 500ms cubic-bezier(0.25,0.46,0.45,0.94) ${i * 60}ms both`
                }}
              >
                <td className="px-5 py-4 font-italic-serif text-sm" style={{ color: "var(--gold)" }}>
                  #{r.booking_reference || `GS-${1000 + r.id}`}
                </td>
                <td className="px-5 py-4 text-white text-sm">{r.customer_name}</td>
                <td className="px-5 py-4 text-white/55 text-sm">{r.customer_phone}</td>
                <td className="px-5 py-4 text-white/85 text-sm">{(r.services || []).join(", ")}</td>
                <td className="px-5 py-4 text-white/75 text-sm">{fmtDate(r.booking_date)}</td>
                <td className="px-5 py-4 text-white text-sm">{r.booking_time}</td>
                <td className="px-5 py-4 serif text-sm" style={{ color: "var(--gold)" }}>₹{(r.total_price || 0).toLocaleString("en-IN")}</td>
                <td className="px-5 py-4"><StatusPill status={r.status} /></td>
                <td className="px-5 py-4"><ActionButtons row={r} onStatus={onStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes rowIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

/* ---------------- Mobile Cards ---------------- */
function MobileCards({ rows, onStatus }) {
  return (
    <div className="md:hidden space-y-4" data-testid="admin-cards">
      {rows.length === 0 && (
        <div className="card-dark p-8 text-center text-white/40 text-sm">No bookings found.</div>
      )}
      {rows.map((r, i) => (
        <div
          key={r.id}
          data-testid={`card-${r.id}`}
          className="card-dark p-6"
          style={{ animation: `rowIn 500ms cubic-bezier(0.25,0.46,0.45,0.94) ${i * 80}ms both` }}
        >
          <div className="flex items-start justify-between">
            <div className="font-italic-serif text-sm" style={{ color: "var(--gold)" }}>
              #{r.booking_reference || `GS-${1000 + r.id}`}
            </div>
            <StatusPill status={r.status} />
          </div>
          <h3 className="serif text-xl mt-3 text-white">{r.customer_name}</h3>
          <div className="text-white/55 text-sm mt-1">{r.customer_phone}</div>
          <div className="text-white/85 text-sm mt-4">{(r.services || []).join(", ")}</div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[0.6rem] tracking-[0.22em] text-white/40">DATE</div>
              <div className="text-white/85 mt-0.5">{fmtDate(r.booking_date)}</div>
            </div>
            <div>
              <div className="text-[0.6rem] tracking-[0.22em] text-white/40">TIME</div>
              <div className="text-white mt-0.5">{r.booking_time}</div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="serif text-lg" style={{ color: "var(--gold)" }}>₹{(r.total_price || 0).toLocaleString("en-IN")}</div>
            <ActionButtons row={r} onStatus={onStatus} />
          </div>
        </div>
      ))}
    </div>
  );
}
