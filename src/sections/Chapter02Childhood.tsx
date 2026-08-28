import { chapter02Childhood } from "../data/content";
import { childhoodPhotos } from "../data/images";
import { useChapterObserver } from "../hooks/useChapterObserver";
import { useReveal } from "../hooks/useReveal";
import { ChapterHeading } from "../components/ChapterHeading";
import { PhotoFrame } from "../components/PhotoFrame";
import { EmptyCategoryNotice } from "../components/EmptyCategoryNotice";
import "./Chapter02Childhood.css";

const TILTS = [-3, 2, -2, 3, -1, 2, -3, 1];

export function Chapter02Childhood() {
  const sectionRef = useChapterObserver<HTMLElement>(chapter02Childhood.number);
  const introRef = useReveal<HTMLDivElement>();

  return (
    <section id="chapter-02" ref={sectionRef} className="chapter childhood">
      <div className="grain" aria-hidden="true" />
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
            {childhoodPhotos.map((photo, i) => (
              <PhotoFrame
                key={photo.id}
                photo={photo}
                variant="album"
                rotation={photo.rotation ?? TILTS[i % TILTS.length]}
                aspectRatio="4 / 5"
                className="childhood__photo"
              />
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
