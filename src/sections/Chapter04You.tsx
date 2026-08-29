import { chapter04You } from "../data/content";
import { herPhotos, type Photo } from "../data/images";
import { useChapterObserver } from "../hooks/useChapterObserver";
import { useReveal } from "../hooks/useReveal";
import { ChapterHeading } from "../components/ChapterHeading";
import { PhotoFrame } from "../components/PhotoFrame";
import { EmptyCategoryNotice } from "../components/EmptyCategoryNotice";
import { FloralAccent } from "../components/FloralAccent";
import { Petals } from "../components/Petals";
import "./Chapter04You.css";

interface Recipe {
  type: "hero" | "offset" | "pair" | "scroll";
  photos: Photo[];
}

function planLayout(photos: Photo[]): Recipe[] {
  if (photos.length === 0) return [];
  const recipes: Recipe[] = [];
  const hero = photos.find((p) => p.featured) ?? photos[0];
  const rest = photos.filter((p) => p.id !== hero.id);
  recipes.push({ type: "hero", photos: [hero] });

  let i = 0;
  const pattern: Array<"offset" | "pair"> = ["offset", "pair", "offset"];
  const scrollCount = rest.length > 6 ? Math.min(4, rest.length - 4) : 0;
  const gridPart = scrollCount > 0 ? rest.slice(0, rest.length - scrollCount) : rest;
  const scrollPart = scrollCount > 0 ? rest.slice(rest.length - scrollCount) : [];

  let p = 0;
  while (i < gridPart.length) {
    const kind = pattern[p % pattern.length];
    const size = kind === "pair" ? 2 : 1;
    const chunk = gridPart.slice(i, i + Math.min(size, gridPart.length - i));
    recipes.push({ type: chunk.length === 2 ? "pair" : "offset", photos: chunk });
    i += chunk.length;
    p += 1;
  }

  if (scrollPart.length > 0) {
    recipes.push({ type: "scroll", photos: scrollPart });
  }

  return recipes;
}

export function Chapter04You() {
  const sectionRef = useChapterObserver<HTMLElement>(chapter04You.number);
  const introRef = useReveal<HTMLDivElement>();
  const bridgeRef = useReveal<HTMLDivElement>();
  const recipes = planLayout(herPhotos);

  return (
    <section id="chapter-04" ref={sectionRef} className="chapter you">
      <FloralAccent className="you__silhouette you__silhouette--left" flip />
      <FloralAccent className="you__silhouette you__silhouette--right" />
      {herPhotos.length > 0 && <Petals />}

      <div className="container">
        <ChapterHeading number={chapter04You.number} title={chapter04You.title} />

        <div ref={introRef} className="you__intro reveal">
          {chapter04You.intro.map((line, i) => (
            <p key={i} className={`display you__intro-line ${i === 0 ? "you__intro-line--lead" : ""}`}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {herPhotos.length > 0 ? (
        <div className="you__editorial">
          {recipes.map((recipe, ri) => {
            const key = recipe.photos.map((p) => p.id).join("-") || ri;
            if (recipe.type === "hero") {
              return (
                <div key={key} className="you__hero container container--wide">
                  <FloralAccent className="you__floral you__floral--hero" />
                  <PhotoFrame photo={recipe.photos[0]} variant="clean" priority className="you__hero-photo" />
                </div>
              );
            }
            if (recipe.type === "offset") {
              const alignEnd = ri % 2 === 0;
              return (
                <div
                  key={key}
                  className={`you__offset container container--wide ${alignEnd ? "you__offset--end" : "you__offset--start"}`}
                >
                  {ri % 4 === 1 && <FloralAccent className="you__floral you__floral--offset" flip={alignEnd} />}
                  <PhotoFrame photo={recipe.photos[0]} variant="clean" />
                </div>
              );
            }
            if (recipe.type === "pair") {
              return (
                <div key={key} className="you__pair container container--wide">
                  {recipe.photos.map((photo) => (
                    <PhotoFrame key={photo.id} photo={photo} variant="clean" />
                  ))}
                </div>
              );
            }
            return (
              <div key={key} className="you__scroll">
                {recipe.photos.map((photo) => (
                  <div key={photo.id} className="you__scroll-item">
                    <PhotoFrame photo={photo} variant="clean" />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="container">
          <EmptyCategoryNotice>( her most beautiful pictures will live here 🤍 )</EmptyCategoryNotice>
        </div>
      )}

      <div className="chapter-bridge chapter-bridge--you-to-today">
        <FloralAccent className="you__bridge-floral" flip />
        <div ref={bridgeRef} className="you__bridge reveal">
          {chapter04You.bridge.map((line, i) => (
            <p key={i} className="display you__bridge-line">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
