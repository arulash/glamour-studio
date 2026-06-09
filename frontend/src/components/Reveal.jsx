import { useEffect, useRef, useState } from "react";

export const Reveal = ({ children, delay = 0, className = "", as: Tag = "div", ...rest }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

export const WordReveal = ({ text, className = "", delayStep = 90, baseDelay = 0 }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setShown(true), baseDelay); obs.unobserve(el); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [baseDelay]);

  // text can contain JSX-like markers in our usage we'll pass plain string and a children renderer
  const words = text.split(" ");
  return (
    <span ref={ref} className={`reveal word-anim ${shown ? "in" : ""} ${className}`}>
      {words.map((w, i) => (
        <span key={i} style={{ transitionDelay: `${i * delayStep}ms` }}>
          {w}{i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
};

export default Reveal;
