import { chapter03Us } from "../data/content";
import { usPhotos, type Photo } from "../data/images";
import { useChapterObserver } from "../hooks/useChapterObserver";
import { useReveal } from "../hooks/useReveal";
import { ChapterHeading } from "../components/ChapterHeading";
import { PhotoFrame } from "../components/PhotoFrame";
import { EmptyCategoryNotice } from "../components/EmptyCategoryNotice";
import { FloralAccent } from "../components/FloralAccent";
import "./Chapter03Us.css";

interface Group {
  type: "hero" | "solo" | "pair";
  photos: Photo[];
}

// The first moment gets a near-fullscreen treatment; everything after
// cycles solo / paired so the gallery reads as art-directed rather than a
// plain grid, however many photos are actually in assets/us/.
const PATTERN: Array<"hero" | 1 | 2> = ["hero", 2, 1, 1, 2, 1, 2];

function groupPhotos(photos: Photo[]): Group[] {
  const groups: Group[] = [];
  let i = 0;
  let p = 0;
  while (i < photos.length) {
    const step = PATTERN[p % PATTERN.length];
    const size = step === "hero" ? 1 : Math.min(step, photos.length - i);
    groups.push({ type: step === "hero" ? "hero" : size === 1 ? "solo" : "pair", photos: photos.slice(i, i + size) });
    i += size;
    p += 1;
  }
  return groups;
}

export function Chapter03Us() {
  const sectionRef = useChapterObserver<HTMLElement>(chapter03Us.number);
  const introRef = useReveal<HTMLDivElement>();
  const groups = groupPhotos(usPhotos);

  return (
    <section id="chapter-03" ref={sectionRef} className="chapter us">
      <div className="light-bloom us__bloom-a" style={{ "--bloom-pos": "12% 8%", "--bloom-color": "rgba(232,189,156,0.5)", "--bloom-opacity": 0.6 } as React.CSSProperties} aria-hidden="true" />
      <div className="light-bloom us__bloom-b" style={{ "--bloom-pos": "88% 70%", "--bloom-color": "rgba(199,141,124,0.4)", "--bloom-opacity": 0.5 } as React.CSSProperties} aria-hidden="true" />

      <div className="container">
        <ChapterHeading number={chapter03Us.number} title={chapter03Us.title} />

        <div ref={introRef} className="us__intro reveal">
          {chapter03Us.intro.map((line, i) => (
            <p key={i} className="display us__intro-line">
              {line}
            </p>
          ))}
        </div>
      </div>

      {usPhotos.length > 0 ? (
        <div className="us__gallery container container--wide">
          {groups.map((group, gi) => {
            const key = group.photos.map((p) => p.id).join("-");
            if (group.type === "hero") {
              return (
                <div key={key} className="us__hero">
                  <PhotoFrame photo={group.photos[0]} variant="clean" priority />
                </div>
              );
            }
            if (group.type === "solo") {
              return (
                <div key={key} className={`us__solo ${gi % 4 === 0 ? "us__solo--overlap" : ""}`}>
                  <PhotoFrame photo={group.photos[0]} variant="clean" />
                </div>
              );
            }
            return (
              <div key={key} className="us__pair">
                {group.photos.map((photo) => (
                  <PhotoFrame key={photo.id} photo={photo} variant="clean" />
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="container">
          <EmptyCategoryNotice>( photos of us will live here 🤍 )</EmptyCategoryNotice>
        </div>
      )}

      <div className="chapter-bridge chapter-bridge--us-to-you">
        <FloralAccent className="us__bridge-floral" />
        <div>
          <p className="display chapter-bridge__text">{chapter03Us.bridge[0]}</p>
          <p className="display chapter-bridge__text chapter-bridge__text--emphasis">{chapter03Us.bridge[1]}</p>
        </div>
      </div>
    </section>
  );
}
