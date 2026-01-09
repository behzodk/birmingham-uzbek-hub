export interface Event {
  id: number;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  fullDescription: string;
  capacity: string;
  category: string;
  color: string;
  featured: boolean;
  highlights?: string[];
  whatToBring?: string[];
  schedule?: { time: string; activity: string }[];
}

export const events: Event[] = [
  {
    id: 1,
    slug: "navruz-celebration-2026",
    title: "Navruz Celebration 2026",
    date: "March 21, 2026",
    time: "6:00 PM - 11:00 PM",
    location: "Great Hall, University of Birmingham",
    description: "Our biggest event of the year! Celebrate the Persian New Year with traditional Uzbek food, live music, folk dancing, and cultural performances. Don't miss the sumalak preparation!",
    fullDescription: `Join us for our grandest celebration of the year as we welcome the spring equinox with **Navruz 2026**! This ancient festival, celebrated for over 3,000 years, marks the beginning of the new year in Uzbek culture.

## What is Navruz?

Navruz (meaning "New Day") is a celebration of renewal, hope, and the triumph of light over darkness. It's a time when families gather, communities unite, and everyone looks forward to a prosperous year ahead.

## The Evening's Program

Experience an unforgettable night filled with:

### Traditional Cuisine 🍽️
Our talented cooks will prepare a feast featuring:
- **Sumalak** – The sacred dish of Navruz, cooked overnight with love and songs
- **Plov** – The king of Uzbek cuisine
- **Somsa & Manti** – Fresh from the oven
- **Halim** – Traditional wheat and meat porridge
- **Navruz sweets** – Including sumalak, navat, and nisholda

### Entertainment 🎭
- Live traditional music with rubab, doira, and dutar
- Classical Uzbek dance performances
- Folk songs and poetry recitations
- Interactive dance sessions – everyone joins in!

### Cultural Activities 🎨
- Haft-sin table display and explanation
- Traditional costume photo booth
- Calligraphy workshop
- Sumalak cooking demonstration

## Important Information

This event is open to everyone – UzSoc members and non-members alike. We want to share the joy of Navruz with the entire Birmingham community!

**Registration is required** due to limited capacity. Early bird tickets get priority seating.

Navruz Muborak! May the new year bring you health, happiness, and prosperity! 🌸`,
    capacity: "300 guests",
    category: "Cultural Festival",
    color: "bg-secondary",
    featured: true,
    highlights: [
      "Traditional Navruz feast with sumalak",
      "Live music and folk dancing",
      "Cultural performances and activities",
      "Photo booth with traditional costumes"
    ],
    whatToBring: [
      "Your appetite!",
      "Friends who want to experience Uzbek culture",
      "Camera for memories"
    ],
    schedule: [
      { time: "6:00 PM", activity: "Doors open & welcome drinks" },
      { time: "6:30 PM", activity: "Sumalak ceremony & cultural explanation" },
      { time: "7:00 PM", activity: "Traditional dinner service" },
      { time: "8:00 PM", activity: "Live performances begin" },
      { time: "9:30 PM", activity: "Open dance floor" },
      { time: "10:45 PM", activity: "Closing ceremony" }
    ]
  },
  {
    id: 2,
    slug: "plov-night",
    title: "Plov Night",
    date: "February 15, 2026",
    time: "7:00 PM - 10:00 PM",
    location: "Student Hub Kitchen",
    description: "Join us for a cozy evening cooking and enjoying authentic Uzbek plov together. Learn the secrets of this iconic dish from our expert cooks!",
    fullDescription: `There's nothing quite like gathering around a steaming kazan of plov! Join us for an intimate evening where we'll cook and enjoy Uzbekistan's most beloved dish together.

## About Plov

Plov (also called osh) is more than just food in Uzbek culture – it's a symbol of hospitality, celebration, and togetherness. Every region has its own style, and we'll be making the classic Tashkent-style plov.

## What to Expect

### Cooking Session 👨‍🍳
- Watch our experienced oshpaz (plov master) prepare authentic plov
- Learn the secrets: the perfect zirvak, rice preparation, and timing
- Understand the cultural significance of each ingredient
- Ask questions and get tips for making plov at home

### The Feast 🍚
Once our plov is ready, we'll gather around the dastarkhan (traditional tablecloth) and enjoy:
- Freshly made plov with all the trimmings
- Achichuk salad (tomato and onion)
- Non (Uzbek bread)
- Traditional green tea

### Social Time ☕
- Connect with fellow students
- Share stories and cultural experiences
- Relaxed, friendly atmosphere

## Who Should Come?

- Anyone curious about Uzbek cuisine
- Students who want to learn cooking skills
- People looking to make new friends
- Food lovers of all backgrounds!

No cooking experience necessary – just bring your appetite and enthusiasm!

Osh bo'lsin! (Bon appétit!) 🍚`,
    capacity: "40 guests",
    category: "Food & Social",
    color: "bg-coral",
    featured: false,
    highlights: [
      "Live plov cooking demonstration",
      "Learn authentic cooking techniques",
      "Enjoy a communal feast",
      "Make new friends"
    ],
    whatToBring: [
      "Comfortable clothes",
      "Containers if you want to take leftovers home",
      "An empty stomach!"
    ],
    schedule: [
      { time: "7:00 PM", activity: "Welcome & introductions" },
      { time: "7:15 PM", activity: "Cooking demonstration begins" },
      { time: "8:30 PM", activity: "Dinner is served" },
      { time: "9:30 PM", activity: "Chai & conversation" }
    ]
  },
  {
    id: 3,
    slug: "cultural-movie-night",
    title: "Cultural Movie Night",
    date: "January 25, 2026",
    time: "7:30 PM - 10:00 PM",
    location: "Lecture Theatre A, Arts Building",
    description: "Watch classic Uzbek cinema with English subtitles. This month: 'The Diary of Nasriddin' - a beloved comedy classic. Snacks provided!",
    fullDescription: `Grab your popcorn and join us for a journey through Uzbek cinema! This month, we're screening the beloved comedy classic "The Diary of Nasriddin" with English subtitles.

## About the Film

**"The Diary of Nasriddin"** (Nasriddinning Kundaligi) is a timeless Uzbek comedy based on the legendary folk tales of Nasriddin Afandi – the wise fool whose clever antics have entertained Central Asians for centuries.

### Why This Film?
- A perfect introduction to Uzbek humor and storytelling
- Beautiful cinematography of Uzbekistan
- Universally funny – no cultural knowledge required!
- A beloved classic that every Uzbek knows

## The Experience

### Before the Film 🍿
- Arrive early for the best seats
- Grab free snacks: popcorn, Uzbek sweets, and drinks
- Brief introduction to the film and its cultural context

### During the Film 🎬
- Enjoy the movie with English subtitles
- Experience the unique Uzbek comedic style
- Comfortable theatre seating

### After the Film 💬
- Optional discussion about the film
- Share your thoughts and favorite moments
- Learn more about Uzbek cinema history

## Snacks Provided

We'll have:
- Popcorn
- Uzbek cookies and sweets
- Soft drinks
- Tea (of course!)

## Coming Up

Next month: "The Shining" (Porloq Yulduz) – a classic Uzbek drama. Stay tuned!

Free entry for all UzSoc members!`,
    capacity: "100 guests",
    category: "Entertainment",
    color: "bg-accent",
    featured: false,
    highlights: [
      "Classic Uzbek comedy film",
      "English subtitles",
      "Free snacks and drinks",
      "Cultural context provided"
    ],
    whatToBring: [
      "Your student ID",
      "Friends who love movies",
      "A sense of humor!"
    ]
  },
  {
    id: 4,
    slug: "uzbek-language-workshop",
    title: "Uzbek Language Workshop",
    date: "January 18, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Seminar Room 3, Main Library",
    description: "Beginner-friendly Uzbek language session. Learn useful phrases, practice pronunciation, and discover the beauty of the Uzbek language!",
    fullDescription: `Ever wanted to learn a few words of Uzbek? Whether you're interested in the language, planning a trip to Uzbekistan, or just curious about Turkic languages, this workshop is for you!

## About the Uzbek Language

Uzbek is a Turkic language spoken by over 35 million people. It has a beautiful, melodic quality and uses the Latin alphabet (since 1992). Fun fact: Uzbek shares many words with Turkish, Kazakh, and even has Persian and Russian influences!

## What You'll Learn

### Basic Greetings & Phrases
- "Salom!" – Hello!
- "Rahmat!" – Thank you!
- "Iltimos" – Please
- "Xayr!" – Goodbye!
- And many more useful expressions

### Numbers & Common Words
- Counting from 1-10
- Days of the week
- Food and drink vocabulary
- Essential travel phrases

### Pronunciation Practice
- Uzbek-specific sounds
- Reading Latin script Uzbek
- Common pronunciation challenges for English speakers

### Cultural Context
- When to use formal vs informal speech
- Common Uzbek expressions and their meanings
- Body language and cultural etiquette

## Who Is This For?

- Complete beginners (no prior knowledge needed!)
- Anyone curious about Central Asian languages
- Students planning to visit Uzbekistan
- Heritage speakers wanting to improve their Uzbek

## Materials

We'll provide:
- Printed phrase sheets to take home
- Audio resources for further practice
- Recommendations for language learning apps

Keling, O'zbek tilini o'rganaylik! (Let's learn Uzbek!) 📚`,
    capacity: "25 guests",
    category: "Workshop",
    color: "bg-primary",
    featured: false,
    highlights: [
      "Learn essential Uzbek phrases",
      "Practice pronunciation with native speakers",
      "Take home learning materials",
      "Beginner-friendly environment"
    ],
    whatToBring: [
      "Notebook and pen",
      "Phone for recording pronunciations",
      "Enthusiasm to learn!"
    ],
    schedule: [
      { time: "3:00 PM", activity: "Introduction to Uzbek language" },
      { time: "3:30 PM", activity: "Greetings and basic phrases" },
      { time: "4:00 PM", activity: "Short break" },
      { time: "4:15 PM", activity: "Pronunciation practice" },
      { time: "4:45 PM", activity: "Q&A and resources" }
    ]
  },
  {
    id: 5,
    slug: "welcome-back-social",
    title: "Welcome Back Social",
    date: "January 10, 2026",
    time: "6:00 PM - 9:00 PM",
    location: "Guild of Students",
    description: "Start the new semester right! Meet new members, reconnect with friends, and enjoy traditional Uzbek tea and snacks.",
    fullDescription: `Welcome back to a new semester! Whether you're a long-time UzSoc member or joining us for the first time, this social is the perfect way to kick off 2026.

## What's This Event About?

After the winter break, it's time to reconnect, meet new faces, and get excited about all the amazing events we have planned for this semester!

## The Vibe

This is a relaxed, casual social event. No formal program – just good company, great snacks, and a warm welcome.

## What to Expect

### Traditional Refreshments ☕
- Authentic Uzbek green tea served from a traditional tea set
- Homemade somsa (savory pastries)
- Fresh non (Uzbek bread)
- Sweet treats and fruit

### Activities & Fun 🎉
- Ice-breaker games to help everyone connect
- Meet the committee
- Preview of Spring semester events
- Raffle with small prizes!

### Networking 🤝
- Meet students from all years and courses
- Connect with Uzbek students and culture enthusiasts
- Find study buddies, friends, and more!

## Who Should Come?

- New students who haven't joined UzSoc yet
- Current members wanting to reconnect
- Anyone interested in Uzbek culture
- Students looking to make new friends

## Important

This is a FREE event open to all UoB students. No registration required – just show up!

We can't wait to see you there! Kelayotganingizdan xursandmiz! 🎊`,
    capacity: "80 guests",
    category: "Social",
    color: "bg-secondary",
    featured: false,
    highlights: [
      "Meet new and returning members",
      "Traditional tea and snacks",
      "Ice-breaker games",
      "Preview of upcoming events"
    ],
    whatToBring: [
      "Your student ID",
      "Friends who want to join UzSoc",
      "Good vibes!"
    ]
  },
];

export const getEventBySlug = (slug: string): Event | undefined => {
  return events.find(event => event.slug === slug);
};
