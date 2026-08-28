import { useEffect, useRef } from "react";
import { chapter05Today } from "../data/content";
import { getEndingPhoto } from "../data/images";
import { useChapterObserver } from "../hooks/useChapterObserver";
import { useReveal } from "../hooks/useReveal";
import { useExperience } from "../context/ExperienceContext";
import { music } from "../data/music";
import { ChapterHeading } from "../components/ChapterHeading";
import { PhotoFrame } from "../components/PhotoFrame";
import { FinalLetter } from "../components/FinalLetter";
import "./Chapter05Today.css";

export function Chapter05Today() {
  const sectionRef = useChapterObserver<HTMLElement>(chapter05Today.number);
  const linesRef = useReveal<HTMLDivElement>();
  const photoRef = useReveal<HTMLDivElement>();
  const endingPhoto = getEndingPhoto();
  const { fadeVolumeTo } = useExperience();
  const hasFaded = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !music.available) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFaded.current) {
          hasFaded.current = true;
          fadeVolumeTo(music.endingVolume, 4000);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [sectionRef, fadeVolumeTo]);

  return (
    <section id="chapter-05" ref={sectionRef} className="chapter today">
      <div className="container">
        <ChapterHeading number={chapter05Today.number} title={chapter05Today.title} />

        <div ref={linesRef} className="today__lines reveal">
          {chapter05Today.lines.map((line, i) => (
            <p key={i} className="display today__line">
              {line}
            </p>
          ))}
        </div>

        {endingPhoto && (
          <div ref={photoRef} className="today__photo reveal">
            <PhotoFrame photo={endingPhoto} variant="clean" />
          </div>
        )}

        <div className="today__letter">
          <FinalLetter />
        </div>
      </div>
    </section>
  );
}
