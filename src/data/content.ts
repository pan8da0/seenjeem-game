// All emotional copy for the site, kept in one place so wording can be
// edited without touching component code. Texts are the exact supplied
// wording — do not rewrite without checking with the author first.

export const intro = {
  greeting: "Leen 🤍",
  lines: [
    "I wanted to give you something",
    "that couldn’t fit inside a box...",
    "So I made you a little world",
    "filled with memories, moments,",
    "and pieces of you.",
  ],
  signOff: "Happy Birthday, Lolo ✨",
  cta: "Open your gift ✨",
};

export const chapter01Chaos = {
  number: "01",
  title: "Chaos 😂",
  intro: ["Before the pretty pictures...", "we need to talk about these 😭"],
  captions: ["Lolo pls 😭", "iconic.", "???", "no explanation needed", "caught in 4k"],
  outro: ["Okay...", "enough of that 😭", "Keep going ↓"],
  bridge: "But before all of that...",
};

export const chapter02Childhood = {
  number: "02",
  title: "Little You 🧸",
  intro: [
    "But before all the memories I know...",
    "there was this little girl.",
    "Same eyes.",
    "Same smile.",
    "Just a little smaller. 🤍",
  ],
  label: "little Leen 🤍",
  bridge: ["And then, somewhere along the way...", "there was us. 🤍"],
};

export const chapter03Us = {
  number: "03",
  title: "Us 🤍",
  intro: [
    "And then, somewhere along the way...",
    "there was us.",
    "A thousand little moments,",
    "some ordinary,",
    "some unforgettable.",
    "And somehow,",
    "they became some of my favorite memories. 🤍",
  ],
  captions: ["somewhere with you", "one of my favorites", "one of those days"],
  bridge: ["But this whole thing isn't really about us...", "It's about you. 🌸"],
};

export const chapter04You = {
  number: "04",
  title: "You 🌸",
  intro: [
    "And then there is you.",
    "The kind of person",
    "who makes ordinary moments",
    "look like something worth remembering.",
    "These are some of my favorite pictures of you.",
    "Not because they're perfect...",
    "but because they're you. 🤍",
  ],
  captions: ["this one. 🤍", "pretty girl.", "favorite."],
  bridge: [
    "And after all these pictures,",
    "all these memories,",
    "all these little moments...",
    "there's only one thing left to say.",
  ],
};

export const chapter05Today = {
  number: "05",
  title: "Today 🎂",
  lines: [
    "Today is your day.",
    "And I hope this little corner of the internet",
    "made you smile,",
    "laugh,",
    "remember,",
    "and maybe feel a little extra loved.",
    "You deserve all the beautiful moments,",
    "all the good memories,",
    "and all the happiness coming your way.",
    "Happy Birthday, Leen. 🤍",
    "Happy Birthday, Lolo.",
  ],
  oneLastThing: "One last thing… ✨",
  letter: [
    "I know this is only a website.",
    "But every picture here is a moment,",
    "and every moment reminded me how special you are.",
    "I hope this year gives you even more reasons to smile,",
    "more places to take pictures,",
    "more memories to keep,",
    "and more moments you'll never want to forget.",
    "I hope I always get to see your smile.",
    "Happy Birthday, Lolo. 🤍",
  ],
};

export const finalMoment = {
  focusLine: "I hope I always get to see your smile.",
  birthday: "Happy Birthday, Lolo. 🤍",
  signature: "Made especially for Leen. 🤍",
};

export const chapterOrder = [
  chapter01Chaos.number,
  chapter02Childhood.number,
  chapter03Us.number,
  chapter04You.number,
  chapter05Today.number,
] as const;

export const totalChapters = chapterOrder.length;
