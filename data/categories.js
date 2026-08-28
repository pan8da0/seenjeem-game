/**
 * Category library — fully data-driven. Add as many categories as you like
 * by pushing another object into this array (see README "How to add a
 * category"); nothing in the game logic has a hardcoded category limit.
 *
 * Shape:
 * { id, nameAr, nameEn, color, icon, descriptionAr, descriptionEn }
 *
 * `icon` must match a key in js/core/icons.js (falls back to a star icon
 * automatically if it doesn't).
 */
window.QUIZ_CATEGORIES = [
  {
    id: 'football',
    nameAr: 'كرة القدم',
    nameEn: 'Football',
    color: '#BA3A26',
    icon: 'football',
    descriptionAr: 'بطولات، لاعبون، وأندية كرة القدم',
    descriptionEn: 'Tournaments, players and football clubs'
  },
  {
    id: 'capitals',
    nameAr: 'الدول والعواصم',
    nameEn: 'Countries & Capitals',
    color: '#1A7F45',
    icon: 'capitals',
    descriptionAr: 'دول العالم وعواصمها',
    descriptionEn: "The world's countries and their capitals"
  },
  {
    id: 'history',
    nameAr: 'التاريخ',
    nameEn: 'History',
    color: '#9026BA',
    icon: 'history',
    descriptionAr: 'أحداث وشخصيات غيّرت التاريخ',
    descriptionEn: 'Events and figures that shaped history'
  },
  {
    id: 'geography',
    nameAr: 'الجغرافيا',
    nameEn: 'Geography',
    color: '#767718',
    icon: 'geography',
    descriptionAr: 'قارات، جبال، أنهار وصحاري',
    descriptionEn: 'Continents, mountains, rivers and deserts'
  },
  {
    id: 'islamic',
    nameAr: 'الإسلاميات',
    nameEn: 'Islamic Studies',
    color: '#217AA1',
    icon: 'islamic',
    descriptionAr: 'أساسيات الدين الإسلامي وأحكامه',
    descriptionEn: 'Fundamentals of Islamic knowledge'
  },
  {
    id: 'quran',
    nameAr: 'القرآن الكريم',
    nameEn: 'The Holy Quran',
    color: '#BA2663',
    icon: 'quran',
    descriptionAr: 'سور، آيات وعلوم القرآن',
    descriptionEn: 'Surahs, verses and Quranic sciences'
  },
  {
    id: 'prophet_biography',
    nameAr: 'السيرة النبوية',
    nameEn: "Prophet's Biography",
    color: '#267F1A',
    icon: 'prophet_biography',
    descriptionAr: 'حياة النبي محمد ﷺ ومواقفه',
    descriptionEn: "The life of Prophet Muhammad ﷺ"
  },
  {
    id: 'companions',
    nameAr: 'الصحابة',
    nameEn: 'The Companions',
    color: '#4026BA',
    icon: 'companions',
    descriptionAr: 'صحابة رسول الله ومواقفهم',
    descriptionEn: 'The Prophet’s companions and their stories'
  },
  {
    id: 'science',
    nameAr: 'علوم',
    nameEn: 'Science',
    color: '#A96223',
    icon: 'science',
    descriptionAr: 'حقائق علمية من مختلف المجالات',
    descriptionEn: 'Scientific facts across many fields'
  },
  {
    id: 'human_body',
    nameAr: 'جسم الإنسان',
    nameEn: 'The Human Body',
    color: '#1A7F67',
    icon: 'human_body',
    descriptionAr: 'أعضاء وأجهزة جسم الإنسان',
    descriptionEn: 'Organs and systems of the human body'
  },
  {
    id: 'space',
    nameAr: 'الفضاء',
    nameEn: 'Space',
    color: '#BA26B3',
    icon: 'space',
    descriptionAr: 'الكواكب، النجوم واستكشاف الفضاء',
    descriptionEn: 'Planets, stars and space exploration'
  },
  {
    id: 'animals',
    nameAr: 'الحيوانات',
    nameEn: 'Animals',
    color: '#5C7F1A',
    icon: 'animals',
    descriptionAr: 'عالم الحيوان والطبيعة',
    descriptionEn: 'The animal kingdom and nature'
  },
  {
    id: 'technology',
    nameAr: 'التكنولوجيا',
    nameEn: 'Technology',
    color: '#265CBA',
    icon: 'technology',
    descriptionAr: 'أجهزة، برمجيات وشركات تقنية',
    descriptionEn: 'Devices, software and tech companies'
  },
  {
    id: 'inventions',
    nameAr: 'الاختراعات',
    nameEn: 'Inventions',
    color: '#BA2631',
    icon: 'inventions',
    descriptionAr: 'اختراعات غيّرت حياة البشر',
    descriptionEn: "Inventions that changed people's lives"
  },
  {
    id: 'arab_cities',
    nameAr: 'مدن عربية',
    nameEn: 'Arab Cities',
    color: '#1C8733',
    icon: 'arab_cities',
    descriptionAr: 'مدن ومعالم الوطن العربي',
    descriptionEn: 'Cities and landmarks of the Arab world'
  },
  {
    id: 'food',
    nameAr: 'الطعام',
    nameEn: 'Food',
    color: '#7226BA',
    icon: 'food',
    descriptionAr: 'أطباق ومأكولات من حول العالم',
    descriptionEn: 'Dishes and cuisine from around the world'
  },
  {
    id: 'general_knowledge',
    nameAr: 'معلومات عامة',
    nameEn: 'General Knowledge',
    color: '#87721C',
    icon: 'general_knowledge',
    descriptionAr: 'معلومات متنوعة وشيقة',
    descriptionEn: 'A little bit of everything'
  },
  {
    id: 'riddles',
    nameAr: 'ألغاز',
    nameEn: 'Riddles',
    color: '#1C7D87',
    icon: 'riddles',
    descriptionAr: 'ألغاز تتحدى ذكاءكم',
    descriptionEn: 'Riddles to test your wits'
  },
  {
    id: 'landmarks',
    nameAr: 'معالم عالمية',
    nameEn: 'World Landmarks',
    color: '#BA2681',
    icon: 'landmarks',
    descriptionAr: 'أشهر المعالم والآثار حول العالم',
    descriptionEn: "The world's most famous landmarks"
  },
  {
    id: 'civilizations',
    nameAr: 'حضارات',
    nameEn: 'Civilizations',
    color: '#3B7F1A',
    icon: 'civilizations',
    descriptionAr: 'حضارات قديمة غيّرت وجه العالم',
    descriptionEn: 'Ancient civilizations that shaped the world'
  },
  {
    id: 'sports_general',
    nameAr: 'رياضة',
    nameEn: 'Sports',
    color: '#262BBA',
    icon: 'sports_general',
    descriptionAr: 'رياضات متنوعة غير كرة القدم',
    descriptionEn: 'A variety of sports beyond football'
  }
];
