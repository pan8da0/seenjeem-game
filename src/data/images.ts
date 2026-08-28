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
}

type Overrides = Partial<
  Record<string, Partial<Pick<Photo, "alt" | "caption" | "rotation" | "objectPosition" | "featured">>>
>;

// Hand-authored touches for specific photos. Anything not listed here still
// renders — it just gets a neutral alt and no caption/rotation. Add a new
// photo by dropping it into src/assets/images/<category>/, running
// `npm run optimize-images`, and optionally adding an entry below.
const overrides: Overrides = {
  "childhood/leen-childhood-01": {
    alt: "Childhood photo of Leen laughing as a toddler",
    featured: true,
  },
  "childhood/leen-childhood-08-collage": {
    alt: "A small collage of childhood and teenage photos of Leen",
    caption: "little Leen 🤍",
  },
  "childhood/leen-childhood-06": {
    caption: "little Leen 🤍",
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
 * Picks a closing photo for the ending chapter. Prefers a featured "her"
 * portrait (the nicest shot of Leen), then a featured "us" photo, then
 * simply the first available photo in a sensible fallback order — so the
 * ending always has something beautiful to show, even before every
 * category is filled in.
 */
export function getEndingPhoto(): Photo | undefined {
  return (
    herPhotos.find((p) => p.featured) ??
    herPhotos[0] ??
    usPhotos.find((p) => p.featured) ??
    usPhotos[0] ??
    childhoodPhotos.find((p) => p.featured) ??
    childhoodPhotos[0] ??
    funnyPhotos[0]
  );
}
