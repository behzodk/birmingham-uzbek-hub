export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  color: string;
  featured: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    slug: "uzsoc-wins-best-cultural-society-award-2025",
    title: "UzSoc Wins Best Cultural Society Award 2025!",
    excerpt: "We're thrilled to announce that the Uzbek Society has been recognized as the Best Cultural Society at the Guild Awards. Thank you to all our amazing members!",
    content: `We're absolutely thrilled to share some incredible news with our community! The Uzbek Society has been officially recognized as the **Best Cultural Society** at the Birmingham Guild of Students Awards 2025.

This prestigious award is a testament to the hard work, dedication, and passion of every single member of our society. From organizing authentic cultural events to creating a welcoming space for students from all backgrounds, we've built something truly special together.

## What This Means

This recognition isn't just about an award – it's about the impact we've made:

- **Over 500 members** joined our society this academic year
- **15+ events** celebrating Uzbek culture and traditions
- **Countless connections** made between students from different backgrounds
- **A vibrant community** that feels like home away from home

## Thank You

A massive thank you goes to:

- Our incredible **Committee members** who work tirelessly behind the scenes
- Our **volunteers** who make every event possible
- Our **sponsors** and the **Uzbek Embassy** for their continued support
- And most importantly, **YOU** – our amazing members!

We couldn't have done this without each and every one of you. Here's to many more years of celebrating Uzbek culture together! 🇺🇿`,
    author: "Committee",
    date: "December 15, 2025",
    category: "Announcement",
    color: "bg-secondary",
    featured: true,
  },
  {
    id: 2,
    slug: "navruz-2025-celebration-recap",
    title: "Recap: Our Incredible Navruz 2025 Celebration",
    excerpt: "Over 250 guests joined us for an unforgettable evening of traditional food, music, and dancing. Check out the highlights and photos from the night!",
    content: `What an absolutely magical evening! Our Navruz 2025 celebration exceeded all expectations, bringing together over 250 guests for a night filled with joy, tradition, and unforgettable memories.

## The Evening's Highlights

### Traditional Feast 🍽️

Our talented volunteers prepared an authentic Uzbek feast featuring:

- **Plov** – The crown jewel of Uzbek cuisine, cooked to perfection in massive kazans
- **Somsa** – Fresh from the oven, with crispy layers and savory filling
- **Manti** – Hand-made dumplings that melted in your mouth
- **Traditional sweets** – Including navat, halva, and fresh fruits

### Music & Dance 💃

The Great Hall was transformed into a celebration of Uzbek artistry:

- Live performances by local musicians playing traditional instruments
- A captivating dance showcase featuring classical Uzbek choreography
- An open dance floor where guests joined in traditional and modern dances

### Cultural Activities 🎨

Guests enjoyed interactive experiences including:

- Traditional Uzbek textile displays
- Calligraphy demonstrations
- Henna art stations
- Photo booth with traditional costumes

## By The Numbers

- **250+ guests** from 20+ countries
- **8 hours** of celebration
- **100+ volunteer hours** in preparation
- **Countless smiles** and new friendships formed

Thank you to everyone who made this night possible. Navruz Muborak! 🌸`,
    author: "Events Team",
    date: "March 25, 2025",
    category: "Event Recap",
    color: "bg-accent",
    featured: false,
  },
  {
    id: 3,
    slug: "partnership-uzbek-embassy",
    title: "New Partnership with Uzbek Embassy",
    excerpt: "We're excited to announce our new partnership with the Embassy of Uzbekistan in London, opening doors for cultural exchanges and special events.",
    content: `We're honored to announce a landmark partnership between the Uzbek Society at the University of Birmingham and the Embassy of the Republic of Uzbekistan in London.

## About the Partnership

This collaboration marks a significant step forward in our mission to promote Uzbek culture and support Uzbek students in the UK. The partnership will enable:

### Cultural Exchange Programs

- Guest speakers and diplomats visiting our events
- Access to official cultural resources and materials
- Support for larger-scale cultural celebrations

### Student Support

- Career guidance sessions with embassy officials
- Networking opportunities with Uzbek professionals in the UK
- Assistance with consular matters for Uzbek students

### Special Events

- Joint hosting of national celebrations
- Official representation at university events
- Cultural exhibitions featuring authentic Uzbek artifacts

## Looking Ahead

This partnership opens exciting new doors for our society. We're already planning several initiatives for the coming year:

1. **Ambassador's Visit** – A special lecture and Q&A session
2. **Cultural Exhibition** – Authentic Uzbek art and crafts display
3. **Career Day** – Connecting students with opportunities in Uzbekistan

We're grateful to the Embassy for recognizing our work and look forward to this fruitful collaboration!`,
    author: "President",
    date: "November 10, 2025",
    category: "Partnership",
    color: "bg-primary",
    featured: false,
  },
  {
    id: 4,
    slug: "volunteer-spotlight-amazing-team",
    title: "Volunteer Spotlight: Meet Our Amazing Team",
    excerpt: "Behind every great event is a team of dedicated volunteers. This month, we're highlighting the incredible people who make UzSoc special.",
    content: `Behind every successful event, every warm welcome, and every memorable moment at UzSoc is a team of incredible volunteers who give their time and energy to make it all happen.

## Meet Some of Our Stars

### Aziza M. – Events Coordinator

*"I love seeing people try Uzbek food for the first time – their reactions are priceless!"*

Aziza has been with us since her first year and has helped organize over 20 events. Her attention to detail and infectious enthusiasm make every event special.

### Rustam K. – Social Media Manager

*"Sharing our culture with the world through social media is so rewarding. The engagement we get from people across the globe is amazing."*

Rustam's creative content has grown our Instagram following by 300% this year!

### Dilnoza S. – Cultural Ambassador

*"Teaching people about Uzbek traditions and seeing them embrace our culture – that's why I volunteer."*

Dilnoza leads our cultural workshops and has introduced hundreds of students to Uzbek traditions.

## Why Volunteer?

Our volunteers tell us that being part of UzSoc has:

- **Built lifelong friendships** with people from all backgrounds
- **Developed valuable skills** in event planning, leadership, and teamwork
- **Created a sense of purpose** and connection to their heritage
- **Made university life** more meaningful and fun

## Join Our Team!

We're always looking for passionate individuals to join our volunteer team. No experience necessary – just bring your enthusiasm!

Reach out to us at volunteer@uzsoc.com or speak to any committee member at our next event.`,
    author: "Media Team",
    date: "October 28, 2025",
    category: "Community",
    color: "bg-coral",
    featured: false,
  },
  {
    id: 5,
    slug: "plov-recipe-make-at-home",
    title: "Plov Recipe: Make It at Home!",
    excerpt: "By popular demand, we're sharing our secret plov recipe. Learn how to make this beloved Uzbek dish in your own kitchen with our step-by-step guide.",
    content: `By overwhelming popular demand, we're finally sharing our beloved plov recipe! This dish is the heart of Uzbek cuisine, traditionally prepared in large kazans for celebrations and gatherings.

## Ingredients (Serves 6-8)

### For the Base
- 500g lamb (shoulder or leg, cubed)
- 400g long-grain rice (preferably Devzira or Basmati)
- 3 large carrots, julienned
- 2 large onions, sliced
- 1 whole head of garlic
- 150ml vegetable oil
- Salt to taste

### Spices
- 1 tsp cumin seeds
- 1 tsp coriander seeds
- ½ tsp turmeric
- Whole black peppercorns
- 1 dried red chili (optional)

## Step-by-Step Instructions

### Step 1: Prepare the Zirvak (Base)

1. Heat oil in a heavy-bottomed pot (kazan if you have one) until very hot
2. Add onions and fry until deep golden brown
3. Add lamb and brown on all sides
4. Add carrots and stir-fry for 5-7 minutes
5. Add spices and enough water to cover meat by 2cm
6. Simmer for 40 minutes until meat is tender

### Step 2: Add the Rice

1. Rinse rice thoroughly until water runs clear
2. Carefully layer rice over the meat mixture
3. Add hot water – it should be about 2cm above the rice
4. Add garlic head (unpeeled) in the center
5. Cook on high until water is absorbed

### Step 3: Steam

1. Make holes in the rice with a chopstick
2. Cover tightly and reduce heat to lowest setting
3. Steam for 25-30 minutes
4. Let rest for 10 minutes before serving

### Step 4: Serve

Mix gently and serve on a large platter with the garlic in the center. Enjoy with fresh salad and hot green tea!

## Pro Tips from Our Elders

- **The oil temperature matters** – it should be smoking hot before adding onions
- **Don't stir the rice** once added – this keeps grains separate
- **Use quality ingredients** – the simplicity of the dish means each element shines

Omadli bo'lsin! (Good luck!) 🍚`,
    author: "Cultural Team",
    date: "October 15, 2025",
    category: "Culture",
    color: "bg-secondary",
    featured: false,
  },
  {
    id: 6,
    slug: "welcome-week-2025-success",
    title: "Welcome Week 2025: A Huge Success",
    excerpt: "We welcomed over 100 new members during Welcome Week! From our stall to our first social, here's how we kicked off the academic year.",
    content: `What an incredible start to the academic year! Welcome Week 2025 was our biggest and best yet, with over 100 new members joining our UzSoc family.

## The Freshers' Fair

Our stall at the Great Hall was buzzing with energy! We:

- Gave out **500+ flyers** about our society
- Shared **traditional Uzbek sweets** that disappeared in hours
- Had **meaningful conversations** with hundreds of curious students
- Signed up **127 new members** on the spot!

## First Social: Chai & Chat

Our first social event of the year was a relaxed Chai & Chat evening where new and returning members could meet each other.

**What we served:**
- Traditional Uzbek green tea
- Homemade samosas and pastries
- Fresh fruits and navat (crystal sugar)

**What happened:**
- Ice-breaker games to help everyone connect
- Committee introductions
- Preview of our exciting events calendar
- Lots of laughter and new friendships!

## What New Members Said

> *"I'm not from Uzbekistan but I felt so welcomed. Can't wait for the next event!"* – Sarah, First Year

> *"Finally found my people! The chai was amazing and everyone was so friendly."* – Jasur, Second Year

> *"I was nervous about starting uni, but joining UzSoc made everything easier."* – Amir, First Year

## What's Next?

This is just the beginning! Here's what we have planned:

- **October:** Plov Night 🍚
- **November:** Cultural Movie Night 🎬
- **December:** Winter Social & Award Ceremony ❄️
- **March:** NAVRUZ 2026 🌸

Thank you to everyone who stopped by and to all our new members – welcome to the family! 🇺🇿`,
    author: "Committee",
    date: "September 30, 2025",
    category: "Event Recap",
    color: "bg-accent",
    featured: false,
  },
];

export const getArticleBySlug = (slug: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.slug === slug);
};
