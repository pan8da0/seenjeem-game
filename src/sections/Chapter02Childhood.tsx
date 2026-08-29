import { chapter02Childhood } from "../data/content";
import { childhoodPhotos } from "../data/images";
import { useChapterObserver } from "../hooks/useChapterObserver";
import { useReveal } from "../hooks/useReveal";
import { ChapterHeading } from "../components/ChapterHeading";
import { PhotoFrame } from "../components/PhotoFrame";
import { EmptyCategoryNotice } from "../components/EmptyCategoryNotice";
import "./Chapter02Childhood.css";

interface Slot {
  size: "hero" | "md" | "sm";
  variant: "album" | "clean";
  rotate: number;
  taped?: boolean;
}

// Three loose clusters of 2-3, each with one slightly larger "hero" moment
// and a mix of framed / unframed photos — an album page, not a grid.
const CLUSTERS: Slot[][] = [
  [
    { size: "hero", variant: "album", rotate: -2, taped: true },
    { size: "sm", variant: "clean", rotate: 4 },
    { size: "sm", variant: "album", rotate: -3 },
  ],
  [
    { size: "md", variant: "clean", rotate: 3 },
    { size: "md", variant: "album", rotate: -4, taped: true },
  ],
  [
    { size: "sm", variant: "album", rotate: 3 },
    { size: "hero", variant: "clean", rotate: -2 },
    { size: "sm", variant: "album", rotate: 4 },
  ],
];

function chunkPhotos<T>(photos: T[], sizes: number[]): T[][] {
  const groups: T[][] = [];
  let i = 0;
  for (const size of sizes) {
    if (i >= photos.length) break;
    groups.push(photos.slice(i, i + size));
    i += size;
  }
  if (i < photos.length) groups.push(photos.slice(i));
  return groups;
}

export function Chapter02Childhood() {
  const sectionRef = useChapterObserver<HTMLElement>(chapter02Childhood.number);
  const introRef = useReveal<HTMLDivElement>();
  const clusters = chunkPhotos(childhoodPhotos, CLUSTERS.map((c) => c.length));

  return (
    <section id="chapter-02" ref={sectionRef} className="chapter childhood">
      <div className="texture-paper childhood__paper" aria-hidden="true" />
      <div className="texture-vintage childhood__vintage" aria-hidden="true" />
      <div className="grain childhood__grain" aria-hidden="true" />
      <div className="container">
        <ChapterHeading number={chapter02Childhood.number} title={chapter02Childhood.title} />

        <div ref={introRef} className="childhood__intro reveal">
          {chapter02Childhood.intro.map((line, i) => (
            <p key={i} className="display childhood__intro-line">
              {line}
            </p>
          ))}
        </div>

        {childhoodPhotos.length > 0 ? (
          <div className="childhood__album">
            {clusters.map((clusterPhotos, ci) => (
              <div key={ci} className="childhood__cluster">
                {clusterPhotos.map((photo, pi) => {
                  const slot = (CLUSTERS[ci] ?? CLUSTERS[0])[pi] ?? { size: "sm", variant: "clean", rotate: 0 };
                  return (
                    <PhotoFrame
                      key={photo.id}
                      photo={photo}
                      variant={slot.variant}
                      rotation={photo.rotation ?? slot.rotate}
                      taped={slot.taped}
                      aspectRatio={photo.aspectRatio ?? "4 / 5"}
                      className={`childhood__photo childhood__photo--${slot.size}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <EmptyCategoryNotice>( little Leen's photos will live here 🤍 )</EmptyCategoryNotice>
        )}
      </div>

      <div className="chapter-bridge chapter-bridge--childhood-to-us">
        <div>
          <p className="display chapter-bridge__text">{chapter02Childhood.bridge[0]}</p>
          <p className="display chapter-bridge__text chapter-bridge__text--emphasis">
            {chapter02Childhood.bridge[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
