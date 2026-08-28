import { chapter03Us } from "../data/content";
import { usPhotos, type Photo } from "../data/images";
import { useChapterObserver } from "../hooks/useChapterObserver";
import { useReveal } from "../hooks/useReveal";
import { ChapterHeading } from "../components/ChapterHeading";
import { PhotoFrame } from "../components/PhotoFrame";
import { EmptyCategoryNotice } from "../components/EmptyCategoryNotice";
import "./Chapter03Us.css";

// Cycles solo / paired layouts so the gallery reads as art-directed rather
// than a plain grid, however many photos are actually in assets/us/.
const GROUP_PATTERN = [1, 2, 1, 1, 2, 1, 2];

function groupPhotos(photos: Photo[]): Photo[][] {
  const groups: Photo[][] = [];
  let i = 0;
  let p = 0;
  while (i < photos.length) {
    const size = Math.min(GROUP_PATTERN[p % GROUP_PATTERN.length], photos.length - i);
    groups.push(photos.slice(i, i + size));
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
          {groups.map((group, gi) =>
            group.length === 1 ? (
              <div key={group[0].id} className="us__solo">
                <PhotoFrame photo={group[0]} variant="clean" priority={gi === 0} />
              </div>
            ) : (
              <div key={group.map((p) => p.id).join("-")} className="us__pair">
                {group.map((photo) => (
                  <PhotoFrame key={photo.id} photo={photo} variant="clean" />
                ))}
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="container">
          <EmptyCategoryNotice>( photos of us will live here 🤍 )</EmptyCategoryNotice>
        </div>
      )}

      <div className="chapter-bridge chapter-bridge--us-to-you">
        <div>
          <p className="display chapter-bridge__text">{chapter03Us.bridge[0]}</p>
          <p className="display chapter-bridge__text chapter-bridge__text--emphasis">{chapter03Us.bridge[1]}</p>
        </div>
      </div>
    </section>
  );
}
