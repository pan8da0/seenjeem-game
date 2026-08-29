import "./ScrapbookDoodles.css";

/** A handful of hand-drawn-feeling marks scattered across the Chaos background. */
export function ScrapbookDoodles() {
  return (
    <div className="scrapbook-doodles" aria-hidden="true">
      <svg className="scrapbook-doodles__mark scrapbook-doodles__mark--star" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 4 L23 17 L36 20 L23 23 L20 36 L17 23 L4 20 L17 17 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="scrapbook-doodles__mark scrapbook-doodles__mark--scribble" viewBox="0 0 90 24" fill="none">
        <path
          d="M2 18 C 14 6, 22 22, 32 12 C 42 4, 50 20, 62 10 C 72 3, 80 16, 88 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <svg className="scrapbook-doodles__mark scrapbook-doodles__mark--circle" viewBox="0 0 60 40" fill="none">
        <path
          d="M30 4 C 46 2, 56 12, 54 22 C 52 34, 34 38, 20 34 C 6 30, 2 18, 10 10 C 16 4, 24 3, 30 4 Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
      <div className="scrapbook-doodles__tape scrapbook-doodles__tape--a" />
      <div className="scrapbook-doodles__tape scrapbook-doodles__tape--b" />
    </div>
  );
}
