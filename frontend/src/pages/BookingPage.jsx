import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, ChevronLeft as ArrLeft } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";
import { SERVICES, RITUALS } from "@/data/site";
import { createBooking, fetchBookedTimesForDate } from "@/lib/supabase";

const STEPS = ["SERVICES", "DATE", "TIME", "DETAILS", "CONFIRM"];

const TIME_SLOTS = (() => {
  const arr = [];
  for (let h = 9; h <= 19; h++) {
    for (const m of [0, 30]) {
      if (h === 19 && m > 30) continue;
      const ampm = h >= 12 ? "PM" : "AM";
      const hh = ((h + 11) % 12) + 1;
      arr.push(`${hh}:${m === 0 ? "00" : "30"} ${ampm}`);
    }
  }
  return arr;
})();

const formatDateKey = (d) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function BookingPage() {
  const [params] = useSearchParams();
  const ritualParam = params.get("ritual");

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const initialRitual = ritualParam && RITUALS.find(r => r.id === ritualParam) ? ritualParam : null;
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedRitual, setSelectedRitual] = useState(initialRitual);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [details, setDetails] = useState({ name: "", phone: "", email: "" });
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationRef, setConfirmationRef] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Trigger booked-slot fetch when a date is picked (no useEffect needed)
  const handleSetDate = (d) => {
    setDate(d);
    if (!d) {
      setBookedTimes([]);
      setLoadingTimes(false);
      return;
    }
    setLoadingTimes(true);
    fetchBookedTimesForDate(formatDateKey(d)).then((times) => {
      setBookedTimes(times);
      setLoadingTimes(false);
    });
  };

  const toggleService = (id) => {
    setSelectedRitual(null);
    setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const pickRitual = (id) => {
    setSelectedRitual(prev => prev === id ? null : id);
    setSelectedServices([]);
  };

  const summary = useMemo(() => {
    if (selectedRitual) {
      const r = RITUALS.find(x => x.id === selectedRitual);
      const items = r.items.map(id => SERVICES.find(s => s.id === id));
      const duration = items.reduce((a, b) => a + b.duration, 0);
      return { items, label: r.name, duration, price: r.price, ritual: r };
    }
    const items = selectedServices.map(id => SERVICES.find(s => s.id === id));
    return {
      items,
      label: items.length ? `${items.length} service${items.length > 1 ? "s" : ""}` : "—",
      duration: items.reduce((a, b) => a + b.duration, 0),
      price: items.reduce((a, b) => a + b.price, 0)
    };
  }, [selectedServices, selectedRitual]);

  const canNext = () => {
    if (step === 0) return selectedServices.length > 0 || !!selectedRitual;
    if (step === 1) return !!date;
    if (step === 2) return !!time;
    if (step === 3) return details.name.trim() && /^\d{10}$/.test(details.phone.trim());
    return true;
  };

  const go = async (n) => {
    if (n > step && !canNext()) {
      if (step === 3) toast.error("Enter a valid name and 10-digit phone.");
      return;
    }
    // CONFIRM BOOKING: step 3 -> 4 submits to Supabase
    if (step === 3 && n === 4) {
      setErrorMsg("");
      setSubmitting(true);
      try {
        const servicesArr = summary.items.map(s => s.short);
        const { reference } = await createBooking({
          customer_name: details.name.trim(),
          customer_phone: details.phone.trim(),
          customer_email: details.email.trim() || null,
          services: servicesArr,
          total_price: summary.price,
          total_duration: summary.duration,
          booking_date: formatDateKey(date),
          booking_time: time
        });
        setConfirmationRef(reference);
        setSubmitting(false);
        setDirection(1);
        setStep(4);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
      } catch (err) {
        console.error("Booking save failed", err);
        setSubmitting(false);
        setErrorMsg("Something went wrong. Please try again.");
      }
      return;
    }
    setDirection(n > step ? 1 : -1);
    setStep(n);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  return (
    <div data-testid="booking-page" className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <Reveal><div className="eyebrow">RESERVATION</div></Reveal>
        <Reveal delay={120}>
          <h1 className="serif mt-6 text-5xl sm:text-6xl lg:text-7xl">
            <span className="text-white">Book Your </span>
            <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Chair</span>
          </h1>
        </Reveal>

        <Progress step={step} />

        <div className="mt-14 relative overflow-hidden">
          <div
            key={step}
            data-testid={`booking-step-${step}`}
            className="step-anim"
            style={{
              animation: `${direction > 0 ? "stepIn" : "stepInBack"} 380ms cubic-bezier(0.22,1,0.36,1)`
            }}
          >
            {step === 0 && <StepServices selectedServices={selectedServices} selectedRitual={selectedRitual} toggleService={toggleService} pickRitual={pickRitual} />}
            {step === 1 && <StepDate date={date} setDate={handleSetDate} />}
            {step === 2 && <StepTime time={time} setTime={setTime} bookedTimes={bookedTimes} loading={loadingTimes} />}
            {step === 3 && <StepDetails details={details} setDetails={setDetails} />}
            {step === 4 && <StepConfirm
              confirmationId={confirmationRef}
              summary={summary}
              date={date}
              time={time}
              details={details}
            />}
          </div>
        </div>

        {step < 4 && (
          <>
            {step !== 0 && (
              <div className="mt-10 sticky bottom-0 z-20" />
            )}
            <SummaryBar summary={summary} />
            {errorMsg && (
              <div
                data-testid="booking-error"
                className="mt-6 px-5 py-4 text-sm tracking-wide"
                style={{
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid var(--gold)",
                  color: "var(--gold)"
                }}
              >
                {errorMsg}
              </div>
            )}
            <div className="mt-8 flex items-center justify-between">
              <button
                data-testid="booking-back"
                disabled={step === 0 || submitting}
                onClick={() => go(step - 1)}
                className="btn-outline-gold disabled:opacity-30"
              >
                <ChevronLeft size={14} /> BACK
              </button>
              <button
                data-testid="booking-next"
                onClick={() => go(step + 1)}
                disabled={!canNext() || submitting}
                className="btn-gold disabled:opacity-40 disabled:pointer-events-none"
              >
                {step === 3
                  ? (submitting ? "CONFIRMING…" : "CONFIRM BOOKING")
                  : "NEXT"} <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes stepIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes stepInBack { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}

function Progress({ step }) {
  return (
    <div data-testid="booking-progress" className="mt-12">
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center" style={{ minWidth: 60 }}>
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-500"
                  style={{
                    width: 38, height: 38,
                    background: done ? "var(--gold)" : active ? "transparent" : "#1a1a1a",
                    border: active ? "1px solid var(--gold)" : done ? "1px solid var(--gold)" : "1px solid #2a2a2a",
                    color: done ? "#0a0a0a" : active ? "var(--gold)" : "#555"
                  }}
                >
                  {done ? <Check size={16} strokeWidth={3} /> : <span className="text-sm font-semibold">{i + 1}</span>}
                </div>
                <div className="mt-3 text-[0.6rem] tracking-[0.22em] hidden sm:block" style={{ color: active || done ? "var(--gold)" : "#555" }}>{label}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-2 relative" style={{ background: "#2a2a2a" }}>
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-700"
                    style={{ width: done ? "100%" : "0%", background: "var(--gold)" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepServices({ selectedServices, selectedRitual, toggleService, pickRitual }) {
  return (
    <div>
      <h2 className="serif text-3xl sm:text-4xl">
        <span className="text-white">Choose Your </span>
        <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Services</span>
      </h2>

      <div className="mt-10 eyebrow">À LA CARTE</div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map(s => {
          const sel = selectedServices.includes(s.id);
          return (
            <button
              key={s.id}
              data-testid={`book-service-${s.id}`}
              onClick={() => toggleService(s.id)}
              className="text-left p-6 transition-all duration-300"
              style={{
                background: sel ? "#1c1c1c" : "var(--bg-3)",
                border: sel ? "1px solid var(--gold)" : "1px solid #2a2a2a",
                boxShadow: sel ? "0 0 30px -10px rgba(201,168,76,0.4)" : "none"
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="serif text-xl text-white">{s.short}</div>
                  <div className="text-white/45 text-xs mt-1">{s.duration} mins</div>
                </div>
                <div className="serif text-lg" style={{ color: "var(--gold)" }}>₹{s.price}</div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[0.65rem] tracking-[0.22em]" style={{ color: sel ? "var(--gold)" : "#555" }}>
                {sel ? <><Check size={12} /> SELECTED</> : "TAP TO SELECT"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-12 mb-6" style={{ height: 1, background: "var(--gold)", opacity: 0.35 }} />
      <div className="eyebrow">GLAMOUR RITUALS — SAVE MORE</div>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        {RITUALS.map(r => {
          const sel = selectedRitual === r.id;
          return (
            <button
              key={r.id}
              data-testid={`book-ritual-${r.id}`}
              onClick={() => pickRitual(r.id)}
              className="relative text-left p-7 transition-all duration-300"
              style={{
                background: sel ? "#1c1c1c" : "var(--bg-3)",
                border: sel || r.popular ? "1px solid var(--gold)" : "1px solid #2a2a2a",
                boxShadow: sel ? "0 0 40px -10px rgba(201,168,76,0.45)" : "none"
              }}
            >
              {r.popular && (
                <span className="absolute -top-3 right-5 text-[0.6rem] tracking-[0.26em] px-3 py-1.5" style={{ background: "var(--gold)", color: "#0a0a0a" }}>MOST POPULAR</span>
              )}
              <div className="font-italic-serif text-[0.65rem] tracking-[0.28em]" style={{ color: "var(--gold)" }}>THE RITUAL</div>
              <h3 className="serif text-2xl mt-2">{r.name}</h3>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="serif text-2xl">₹{r.price.toLocaleString("en-IN")}</span>
                <span className="text-[0.7rem] tracking-[0.22em]" style={{ color: "var(--gold)" }}>SAVE ₹{r.save}</span>
              </div>
              <div className="mt-4 text-[0.65rem] tracking-[0.22em]" style={{ color: sel ? "var(--gold)" : "#555" }}>
                {sel ? "✓ RITUAL SELECTED" : "TAP TO SELECT RITUAL"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDate({ date, setDate }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const monthName = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const startOffset = firstDay.getDay();
  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(month.getFullYear(), month.getMonth(), d));

  const sameDay = (a, b) => a && b && a.toDateString() === b.toDateString();

  return (
    <div>
      <h2 className="serif text-3xl sm:text-4xl">
        <span className="text-white">Pick a </span>
        <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Date</span>
      </h2>

      <div className="mt-10 max-w-2xl mx-auto card-dark p-8">
        <div className="flex items-center justify-between">
          <button data-testid="cal-prev" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-2 hover:text-[color:var(--gold)] transition" style={{ color: "var(--gold)" }}>
            <ChevronLeft size={18} />
          </button>
          <div className="serif text-xl">{monthName}</div>
          <button data-testid="cal-next" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-2 hover:text-[color:var(--gold)] transition" style={{ color: "var(--gold)" }}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[0.65rem] tracking-[0.22em] text-white/40">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {days.map((d, i) => {
            if (!d) return <div key={i} className="aspect-square" />;
            const isPast = d < today;
            const isTuesday = d.getDay() === 2;
            const isToday = sameDay(d, today);
            const isSelected = sameDay(d, date);
            const disabled = isPast || isTuesday;
            return (
              <button
                key={i}
                data-testid={`cal-day-${d.getDate()}`}
                disabled={disabled}
                onClick={() => setDate(d)}
                className="aspect-square flex items-center justify-center text-sm transition-all duration-200"
                style={{
                  background: isSelected ? "var(--gold)" : "transparent",
                  color: isSelected ? "#0a0a0a" : disabled ? "#3a3a3a" : "#fff",
                  border: isToday && !isSelected ? "1px solid var(--gold)" : "1px solid transparent",
                  textDecoration: isTuesday ? "line-through" : "none",
                  fontWeight: isSelected ? 700 : 400,
                  cursor: disabled ? "not-allowed" : "pointer"
                }}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-white/40 text-center">Closed on Tuesdays. Past dates unavailable.</p>
      </div>
    </div>
  );
}

function StepTime({ time, setTime, bookedTimes = [], loading = false }) {
  const bookedSet = new Set(bookedTimes);
  return (
    <div>
      <h2 className="serif text-3xl sm:text-4xl">
        <span className="text-white">Pick a </span>
        <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Time</span>
      </h2>
      <p className="mt-4 text-white/50 text-sm">
        {loading ? "Checking availability…" : "Slots in grey are already booked."}
      </p>
      <div className="mt-10 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {TIME_SLOTS.map(t => {
          const booked = bookedSet.has(t);
          const sel = time === t;
          return (
            <button
              key={t}
              data-testid={`time-${t.replace(/[: ]/g, "")}`}
              disabled={booked || loading}
              onClick={() => setTime(t)}
              className="py-3 text-sm tracking-wider rounded-full transition-all duration-300"
              style={{
                background: sel ? "var(--gold)" : "transparent",
                color: sel ? "#0a0a0a" : booked ? "#444" : "#fff",
                border: `1px solid ${sel ? "var(--gold)" : booked ? "#222" : "#3a3a3a"}`,
                cursor: (booked || loading) ? "not-allowed" : "pointer",
                fontWeight: sel ? 700 : 500,
                opacity: loading ? 0.6 : 1
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDetails({ details, setDetails }) {
  return (
    <div>
      <h2 className="serif text-3xl sm:text-4xl">
        <span className="text-white">Your </span>
        <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Details</span>
      </h2>
      <div className="mt-10 max-w-2xl space-y-7">
        <div>
          <label className="field-label">FULL NAME <span style={{ color: "var(--gold)" }}>*</span></label>
          <input data-testid="details-name" className="field" value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} />
        </div>
        <div>
          <label className="field-label">PHONE (10 DIGITS) <span style={{ color: "var(--gold)" }}>*</span></label>
          <input data-testid="details-phone" inputMode="numeric" maxLength={10} className="field" value={details.phone} onChange={e => setDetails({ ...details, phone: e.target.value.replace(/\D/g, "") })} />
        </div>
        <div>
          <label className="field-label">EMAIL <span className="text-white/30">(optional)</span></label>
          <input data-testid="details-email" type="email" className="field" value={details.email} onChange={e => setDetails({ ...details, email: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function StepConfirm({ confirmationId, summary, date, time, details }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mx-auto" style={{ width: 80, height: 80 }}>
        <svg viewBox="0 0 80 80" width="80" height="80">
          <circle cx="40" cy="40" r="38" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
          <path d="M24 41 L36 53 L58 29" fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            style={{ strokeDasharray: 80, strokeDashoffset: 80, animation: "draw 800ms 200ms ease forwards" }} />
        </svg>
      </div>
      <h2 className="serif mt-6 text-4xl sm:text-5xl">
        <span className="text-white">Thank </span>
        <span className="font-italic-serif" style={{ color: "var(--gold)" }}>You</span>
      </h2>
      <p className="mt-3 text-white/55">Your chair is reserved. We&apos;ll see you soon.</p>

      <div data-testid="booking-confirmation" className="mt-10 card-dark p-8 text-left" style={{ borderColor: "var(--gold)" }}>
        <div className="text-[0.7rem] tracking-[0.28em]" style={{ color: "var(--gold)" }}>CONFIRMATION NUMBER</div>
        <div className="serif text-2xl mt-1">#{confirmationId}</div>

        <div className="mt-6 space-y-2">
          {summary.items.map((s, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-white/85">{s.short}</span>
              <span className="text-white/55">₹{s.price}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t flex justify-between" style={{ borderColor: "rgba(201,168,76,0.3)" }}>
          <span className="text-[0.72rem] tracking-[0.26em]" style={{ color: "var(--gold)" }}>TOTAL</span>
          <span className="serif text-2xl" style={{ color: "var(--gold)" }}>₹{summary.price.toLocaleString("en-IN")}</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[0.65rem] tracking-[0.22em] text-white/40">DATE</div>
            <div className="mt-1">{date ? date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "—"}</div>
          </div>
          <div>
            <div className="text-[0.65rem] tracking-[0.22em] text-white/40">TIME</div>
            <div className="mt-1">{time || "—"}</div>
          </div>
          <div>
            <div className="text-[0.65rem] tracking-[0.22em] text-white/40">NAME</div>
            <div className="mt-1">{details.name}</div>
          </div>
          <div>
            <div className="text-[0.65rem] tracking-[0.22em] text-white/40">PHONE</div>
            <div className="mt-1">{details.phone}</div>
          </div>
        </div>
      </div>

      <Link to="/" data-testid="back-to-home" className="btn-gold mt-10">BACK TO HOME</Link>

      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
    </div>
  );
}

function SummaryBar({ summary }) {
  if (!summary.items.length) return null;
  return (
    <div data-testid="summary-bar" className="mt-12 p-5 lg:p-6 card-dark flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="text-[0.65rem] tracking-[0.26em] text-white/40">SELECTED</div>
        <div className="serif text-lg mt-1">{summary.label}</div>
      </div>
      <div className="flex items-center gap-10">
        <div>
          <div className="text-[0.65rem] tracking-[0.26em] text-white/40">DURATION</div>
          <div className="serif text-lg mt-1">{summary.duration} mins</div>
        </div>
        <div>
          <div className="text-[0.65rem] tracking-[0.26em] text-white/40">TOTAL</div>
          <div className="serif text-2xl mt-1" style={{ color: "var(--gold)" }}>₹{summary.price.toLocaleString("en-IN")}</div>
        </div>
      </div>
    </div>
  );
}
