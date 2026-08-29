import { useReveal } from "../hooks/useReveal";
import type { Photo } from "../data/images";
import "./PhotoFrame.css";

interface PhotoFrameProps {
  photo: Photo;
  variant?: "clean" | "polaroid" | "album";
  priority?: boolean;
  className?: string;
  /** Overrides photo.rotation, in degrees. */
  rotation?: number;
  /** Overrides the box's natural aspect ratio, e.g. "4 / 5". */
  aspectRatio?: string;
  /** A small strip of paper tape at the top edge. Defaults on for polaroid. */
  taped?: boolean;
}

export function PhotoFrame({
  photo,
  variant = "clean",
  priority = false,
  className = "",
  rotation,
  aspectRatio,
  taped,
}: PhotoFrameProps) {
  const ref = useReveal<HTMLDivElement>();
  const tilt = rotation ?? photo.rotation ?? 0;
  const showTape = taped ?? variant === "polaroid";

  return (
    <figure
      ref={ref}
      className={`photo-frame photo-frame--${variant} ${showTape ? "photo-frame--taped" : ""} reveal ${className}`}
      style={tilt ? ({ "--tilt": `${tilt}deg` } as React.CSSProperties) : undefined}
    >
      <div
        className="photo-frame__box"
        style={{ aspectRatio: aspectRatio ?? photo.aspectRatio ?? `${photo.width} / ${photo.height}` }}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{ objectPosition: photo.objectPosition }}
        />
      </div>
      {photo.caption && <figcaption className="photo-frame__caption hand">{photo.caption}</figcaption>}
    </figure>
  );
}
