// Drop a track at src/assets/music/background.mp3 (or .m4a) and it will be
// picked up automatically — no code changes needed. Until then the site
// works perfectly with the music control simply hidden.

const modules = import.meta.glob("/src/assets/music/*.{mp3,m4a,ogg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const track = Object.values(modules)[0];

export const music = {
  src: track as string | undefined,
  available: Boolean(track),
  volume: 0.3,
  endingVolume: 0.14,
};
