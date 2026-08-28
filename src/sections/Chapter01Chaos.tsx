import { chapter01Chaos } from "../data/content";
import { funnyPhotos } from "../data/images";
import { useChapterObserver } from "../hooks/useChapterObserver";
import { useReveal } from "../hooks/useReveal";
import { ChapterHeading } from "../components/ChapterHeading";
import { PhotoFrame } from "../components/PhotoFrame";
import { EmptyCategoryNotice } from "../components/EmptyCategoryNotice";
import "./Chapter01Chaos.css";

const TILTS = [-6, 4, -3, 6, -5, 3, -4, 5, -6, 2, -3, 5];

export function Chapter01Chaos() {
  const sectionRef = useChapterObserver<HTMLElement>(chapter01Chaos.number);
  const introRef = useReveal<HTMLDivElement>();
  const outroRef = useReveal<HTMLDivElement>();

  return (
    <section id="chapter-01" ref={sectionRef} className="chapter chaos">
      <div className="chaos__doodle chaos__doodle--arrow" aria-hidden="true">
        ↴
      </div>
      <div className="container">
        <ChapterHeading number={chapter01Chaos.number} title={chapter01Chaos.title} />

        <div ref={introRef} className="chaos__intro reveal">
          {chapter01Chaos.intro.map((line, i) => (
            <p key={i} className="display chaos__intro-line">
              {line}
            </p>
          ))}
        </div>

        {funnyPhotos.length > 0 ? (
          <div className="chaos__scrapbook">
            {funnyPhotos.map((photo, i) => (
              <PhotoFrame
                key={photo.id}
                photo={photo}
                variant="polaroid"
                rotation={photo.rotation ?? TILTS[i % TILTS.length]}
                className="chaos__photo"
              />
            ))}
          </div>
        ) : (
          <EmptyCategoryNotice>( the chaotic photos will live here 🤍 )</EmptyCategoryNotice>
        )}

        <div ref={outroRef} className="chaos__outro reveal">
          <p className="display">{chapter01Chaos.outro[0]}</p>
          <p className="display">{chapter01Chaos.outro[1]}</p>
          <p className="hand chaos__keep-going">{chapter01Chaos.outro[2]}</p>
        </div>
      </div>

      <div className="chapter-bridge chapter-bridge--chaos-to-childhood">
        <p className="hand chapter-bridge__text">{chapter01Chaos.bridge}</p>
      </div>
    </section>
  );
}
