import { useReveal } from "../hooks/useReveal";
import "./ChapterHeading.css";

export function ChapterHeading({ number, title }: { number: string; title: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="chapter-heading reveal">
      <span className="eyebrow">Chapter {number}</span>
      <h2 className="display chapter-heading__title">{title}</h2>
    </div>
  );
}
