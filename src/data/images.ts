import dimensions from "./imageDimensions.generated.json";

export type Category = "funny" | "childhood" | "us" | "her";

export interface Photo {
  id: string;
  category: Category;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  /** Degrees, used for the scrapbook look in Chapter 01. */
  rotation?: number;
  /** CSS object-position, for portraits that need a specific focal point. */
  objectPosition?: string;
  /** Marks a photo for a larger / hero treatment in its chapter. */
  featured?: boolean;
  /** Overrides the natural aspect ratio, e.g. to crop out a source artifact. */
  aspectRatio?: string;
}

type Overrides = Partial<
  Record<
    string,
    Partial<Pick<Photo, "alt" | "caption" | "rotation" | "objectPosition" | "featured" | "aspectRatio">>
  >
>;

// Hand-authored touches for specific photos. Anything not listed here still
// renders — it just gets a neutral alt and no caption/rotation. Add a new
// photo by dropping it into src/assets/images/<category>/, running
// `npm run optimize-images`, and optionally adding an entry below.
// Several childhood photos were screenshotted from a phone carousel/album
// view, which baked a black letterbox into the photo itself (varying
// amounts of black top and/or bottom, occasionally a caption bar). Each
// crop below is tuned by hand to that specific photo's letterbox — this is
// a presentation-only crop (object-position + a taller/shorter box), the
// source file in src/assets/images/ is never touched.
const overrides: Overrides = {
  "childhood/leen-childhood-01": {
    alt: "Childhood photo of Leen laughing as a toddler",
    featured: true,
    aspectRatio: "1170 / 1063",
    objectPosition: "center 40%",
  },
  "childhood/leen-childhood-05": {
    aspectRatio: "1242 / 1435",
    objectPosition: "center 45%",
  },
  "childhood/leen-childhood-06": {
    caption: "little Leen 🤍",
    aspectRatio: "1242 / 1744",
    objectPosition: "center 40%",
  },
  "childhood/leen-childhood-07": {
    aspectRatio: "1242 / 1413",
    objectPosition: "center 55%",
  },
  "childhood/leen-childhood-08-collage": {
    alt: "A small collage of childhood and teenage photos of Leen",
    caption: "little Leen 🤍",
    aspectRatio: "1020 / 1324",
    objectPosition: "center 45%",
  },

  "us/leen-us-01": {
    alt: "Leen and friends together outdoors among palm trees",
    featured: true,
  },
  "us/leen-us-05": {
    alt: "Leen and a friend taking a mirror photo together",
  },
  "us/leen-us-06": {
    alt: "Leen and a friend posing by an illuminated city sign at night",
    caption: "somewhere with you",
  },
  "us/leen-us-09": {
    alt: "Leen and a friend together at night by a lit-up city sign",
  },
  "us/leen-us-10": {
    alt: "Leen and friends together in an elevator mirror selfie",
    caption: "one of those days",
  },

  // These four were screenshotted from a phone carousel view, which baked a
  // small page-counter badge into the top-right corner of the photo itself.
  // Cropped a bit off the top here (presentation only — the source file in
  // src/assets/images/ is untouched) so it doesn't show.
  "her/leen-her-01": {
    alt: "Leen smiling in front of an old stone building",
    aspectRatio: "1169 / 1330",
    objectPosition: "center 55%",
  },
  "her/leen-her-05": {
    aspectRatio: "1169 / 1330",
    objectPosition: "center 60%",
  },
  "her/leen-her-06": {
    aspectRatio: "1169 / 1315",
    objectPosition: "center 55%",
  },
  "her/leen-her-07": {
    aspectRatio: "1169 / 1090",
    objectPosition: "center 50%",
  },
  "her/leen-her-08": {
    alt: "Leen smiling at an illuminated night market",
    aspectRatio: "1169 / 1140",
    objectPosition: "center 40%",
  },
  "her/leen-her-02": {
    alt: "Leen sitting by an ornate iron gate with a red flower in her hair",
    caption: "pretty girl.",
  },
  "her/leen-her-11": {
    alt: "Black and white portrait of Leen wearing sunglasses and hair curlers",
    featured: true,
    caption: "favorite.",
  },
  "her/leen-her-16": {
    alt: "Leen laughing, relaxed on a couch",
    caption: "this one. 🤍",
  },

  "funny/leen-funny-02": {
    alt: "Leen laughing with her hands on her cheeks",
    caption: "Lolo pls 😭",
  },
  "funny/leen-funny-06": {
    alt: "Leen laughing on a couch with her legs kicked up",
    caption: "iconic.",
  },
  "funny/leen-funny-08": {
    alt: "Leen asleep and squished against a plane window",
    caption: "caught in 4k",
  },
};

const modules = import.meta.glob("/src/assets/images-web/**/*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const dims = dimensions as Record<string, { width: number; height: number }>;

function toAlt(category: Category, id: string): string {
  const label: Record<Category, string> = {
    funny: "Funny photo of Leen",
    childhood: "Childhood photo of Leen",
    us: "Photo of Leen and a friend",
    her: "Photo of Leen",
  };
  return overrides[`${category}/${id}`]?.alt ?? label[category];
}

function toPhoto(path: string, src: string): Photo | null {
  const match = path.match(/images-web\/(funny|childhood|us|her)\/([^/]+)\.jpg$/);
  if (!match) return null;
  const [, category, id] = match as [string, Category, string];
  const key = `${category}/${id}`;
  const size = dims[`${category}/${id}.jpg`] ?? { width: 4, height: 5 };
  const meta = overrides[key];
  return {
    id,
    category,
    src,
    width: size.width,
    height: size.height,
    alt: toAlt(category, id),
    caption: meta?.caption,
    rotation: meta?.rotation,
    objectPosition: meta?.objectPosition ?? (category === "childhood" ? "center 64%" : "center"),
    featured: meta?.featured ?? false,
    aspectRatio: meta?.aspectRatio,
  };
}

const allPhotos: Photo[] = Object.entries(modules)
  .map(([path, src]) => toPhoto(path, src))
  .filter((p): p is Photo => p !== null)
  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

export function getPhotos(category: Category): Photo[] {
  return allPhotos.filter((p) => p.category === category);
}

export const funnyPhotos = getPhotos("funny");
export const childhoodPhotos = getPhotos("childhood");
export const usPhotos = getPhotos("us");
export const herPhotos = getPhotos("her");

/**
 * Picks a closing photo for the ending chapter. Deliberately avoids
 * reusing the "her" chapter's featured hero photo, so the ending feels
 * like a new beautiful moment rather than a repeat. Falls back through
 * "her" -> "us" -> "childhood" -> "funny" so the ending always has
 * something to show, even before every category is filled in.
 */
export function getEndingPhoto(): Photo | undefined {
  const heroId = herPhotos.find((p) => p.featured)?.id;
  return (
    herPhotos.find((p) => p.id !== heroId) ??
    herPhotos[0] ??
    usPhotos.find((p) => p.featured) ??
    usPhotos[0] ??
    childhoodPhotos.find((p) => p.featured) ??
    childhoodPhotos[0] ??
    funnyPhotos[0]
  );
}
