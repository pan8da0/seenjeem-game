import { useEffect, useRef } from "react";

/**
 * Adds `.is-visible` to the element (and thus triggers the `.reveal` CSS
 * transition) the first time it scrolls into view. Cheap, GPU-friendly,
 * and works identically whether or not the element also participates in a
 * GSAP timeline elsewhere.
 */
export function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px", ...options },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
