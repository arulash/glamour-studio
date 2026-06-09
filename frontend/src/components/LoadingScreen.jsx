import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("glamour_loaded");
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return undefined;
    const t1 = setTimeout(() => setFadeOut(true), 1200);
    const t2 = setTimeout(() => {
      sessionStorage.setItem("glamour_loaded", "1");
      setShow(false);
    }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [show]);

  if (!show) return null;

  return (
    <div
      data-testid="loading-screen"
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center ${fadeOut ? "loader-fade-out" : ""}`}
    >
      <div className="text-center">
        <div className="serif text-4xl md:text-6xl tracking-wide">
          <span className="text-white">Glamour</span>{" "}
          <span className="font-italic-serif" style={{ color: "var(--gold)" }}>Studio</span>
        </div>
        <div className="mt-6 mx-auto" style={{ width: 80, height: 1, background: "var(--gold)" }} />
      </div>
    </div>
  );
}
