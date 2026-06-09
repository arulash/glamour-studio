export default function BeforeAfter({ src, idx = 0 }) {
  return (
    <div
      data-testid={`before-after-${idx}`}
      className="relative w-full overflow-hidden card-dark"
      style={{ aspectRatio: "1 / 1" }}
    >
      <img src={src} alt={`Transformation ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
      {/* Gold center divider */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: "50%",
          width: 2,
          background: "var(--gold)",
          transform: "translateX(-1px)",
          boxShadow: "0 0 20px rgba(201,168,76,0.55)"
        }}
      />
      {/* Center handle pill */}
      <div
        className="absolute top-1/2 left-1/2 flex items-center justify-center"
        style={{
          transform: "translate(-50%, -50%)",
          width: 38, height: 38,
          borderRadius: 999,
          background: "rgba(10,10,10,0.85)",
          border: "1px solid var(--gold)",
          color: "var(--gold)",
          fontSize: 14, fontWeight: 700
        }}
      >
        ‹›
      </div>
      {/* Labels */}
      <span className="absolute left-4 top-4 text-[0.65rem] tracking-[0.3em] uppercase text-white/90 bg-black/55 px-3 py-1.5 border border-white/15">BEFORE</span>
      <span className="absolute right-4 top-4 text-[0.65rem] tracking-[0.3em] uppercase bg-black/55 px-3 py-1.5 border" style={{ color: "var(--gold)", borderColor: "var(--gold)" }}>AFTER</span>
    </div>
  );
}
