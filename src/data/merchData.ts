export interface Product {
  id: number;
  slug: string;
  name: string;
  price: string;
  description: string;
  fullDescription: string;
  sizes: string[];
  color: string;
  bestseller: boolean;
  category: string;
  features?: string[];
  careInstructions?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    slug: "uzsoc-classic-hoodie",
    name: "UzSoc Classic Hoodie",
    price: "£35",
    description: "Premium quality hoodie featuring our iconic logo. Warm, cozy, and perfect for campus life.",
    fullDescription: `Our flagship hoodie that every UzSoc member needs! This premium quality hoodie features our iconic logo and is designed for maximum comfort during those long library sessions and chilly walks across campus.

## Design

The UzSoc Classic Hoodie showcases our society logo prominently on the front, with a subtle Uzbek-inspired pattern detail on the sleeve. The design balances modern streetwear aesthetics with traditional Uzbek elements.

### Logo Details
- Front: Large embroidered UzSoc logo
- Back: "Uzbek Society UoB" text
- Sleeve: Small Uzbek pattern accent

## Quality & Comfort

We've sourced the best materials to ensure this hoodie lasts:
- 80% cotton, 20% polyester blend
- 280 GSM heavyweight fabric
- Brushed fleece interior for extra warmth
- Double-lined hood with matching drawstrings
- Kangaroo pocket for essentials

## Sizing

Our hoodies run true to size. If you prefer an oversized fit, we recommend sizing up.

## Perfect For

- Campus life and lectures
- Society events and socials
- Representing UzSoc at fairs
- Cozy nights in the library
- Showing your Uzbek pride!

## Supporting UzSoc

Every purchase directly supports our society's activities and events. Your hoodie helps fund cultural celebrations, guest speakers, and community initiatives.`,
    sizes: ["S", "M", "L", "XL"],
    color: "bg-primary",
    bestseller: true,
    category: "Clothing",
    features: [
      "Premium 280 GSM fabric",
      "Embroidered logo",
      "Kangaroo pocket",
      "Double-lined hood"
    ],
    careInstructions: [
      "Machine wash cold",
      "Tumble dry low",
      "Do not bleach",
      "Iron on low if needed"
    ]
  },
  {
    id: 2,
    slug: "uzbekistan-flag-tee",
    name: "Uzbekistan Flag Tee",
    price: "£18",
    description: "Soft cotton t-shirt with a stylized Uzbek flag design. Show your pride!",
    fullDescription: `Wear your heritage with pride! This stylish t-shirt features a modern, artistic interpretation of the Uzbek flag that's perfect for everyday wear.

## Design

Unlike a standard flag print, our design reimagines the Uzbek flag elements in a contemporary way:
- Abstract geometric interpretation of the flag
- Turquoise, white, and green color palette
- Stars and crescent moon motif
- Subtle distressed effect for a vintage look

## Quality

Comfort meets durability:
- 100% ring-spun cotton
- 180 GSM for perfect weight
- Pre-shrunk fabric
- Soft hand feel
- Ribbed crew neck

## Fit

Classic unisex fit that works for everyone. True to size – check our size guide for measurements.

## Styling Ideas

- Pair with jeans for casual everyday look
- Layer under a jacket or hoodie
- Great for society events and socials
- Perfect for celebrating national holidays

Show the world where you're from – or show your love for Uzbekistan!`,
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: "bg-accent",
    bestseller: false,
    category: "Clothing",
    features: [
      "100% ring-spun cotton",
      "Stylized flag design",
      "Pre-shrunk fabric",
      "Unisex fit"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Tumble dry low",
      "Do not iron on print"
    ]
  },
  {
    id: 3,
    slug: "doppi-beanie",
    name: "Doppi Beanie",
    price: "£15",
    description: "Modern beanie inspired by traditional Uzbek doppi patterns. Keep warm in style!",
    fullDescription: `A modern twist on a timeless classic! Our Doppi Beanie takes inspiration from the traditional Uzbek skullcap (doppi) and transforms it into a cozy winter essential.

## Design Inspiration

The traditional doppi is a beautifully embroidered skullcap worn across Central Asia. Our beanie captures this heritage with:
- Geometric patterns inspired by authentic doppi embroidery
- Color palette drawn from traditional designs
- Modern silhouette for everyday wear
- Subtle "UzSoc" branding

## Quality & Warmth

Stay warm during those cold Birmingham winters:
- Acrylic and wool blend
- Ribbed knit construction
- Stretchy fit for all head sizes
- Fold-up brim option
- Warm without being too bulky

## One Size Fits All

Our beanie is designed with stretch to comfortably fit all head sizes.

## Cultural Significance

The doppi holds special meaning in Uzbek culture, traditionally worn during celebrations, prayers, and daily life. Our modern interpretation allows you to carry a piece of this tradition wherever you go.

Perfect for campus life, winter walks, and staying connected to your heritage!`,
    sizes: ["One Size"],
    color: "bg-secondary",
    bestseller: true,
    category: "Accessories",
    features: [
      "Traditional doppi-inspired design",
      "Wool and acrylic blend",
      "Stretchy one-size-fits-all",
      "Fold-up brim option"
    ],
    careInstructions: [
      "Hand wash recommended",
      "Lay flat to dry",
      "Do not tumble dry"
    ]
  },
  {
    id: 4,
    slug: "uzsoc-tote-bag",
    name: "UzSoc Tote Bag",
    price: "£12",
    description: "Sturdy canvas tote with our logo. Perfect for books, groceries, or everything in between.",
    fullDescription: `The perfect companion for campus life! Our sturdy canvas tote bag features the UzSoc logo and is designed to carry everything from textbooks to groceries.

## Design

Clean and versatile design that goes with everything:
- Large UzSoc logo on one side
- Uzbek pattern border detail
- Natural canvas color
- Minimalist aesthetic

## Build Quality

Made to last through years of use:
- Heavy-duty 12oz canvas
- Reinforced stitching
- Comfortable shoulder straps
- Generous size: 38cm x 42cm
- Internal pocket for small items

## Eco-Friendly

Say goodbye to plastic bags! Our reusable tote is:
- Made from natural cotton canvas
- Designed for years of use
- Easy to clean and maintain
- A sustainable choice

## Uses

So many ways to use your UzSoc tote:
- Carry books to lectures
- Weekly grocery shopping
- Beach or picnic outings
- Library study sessions
- Gym clothes and essentials
- Overnight bag for trips

A practical way to rep your society every day!`,
    sizes: ["One Size"],
    color: "bg-coral",
    bestseller: false,
    category: "Accessories",
    features: [
      "Heavy-duty 12oz canvas",
      "Reinforced stitching",
      "Internal pocket",
      "Generous size"
    ],
    careInstructions: [
      "Machine wash cold",
      "Air dry",
      "Iron if needed"
    ]
  },
  {
    id: 5,
    slug: "silk-road-sticker-pack",
    name: "Silk Road Sticker Pack",
    price: "£5",
    description: "Set of 10 unique stickers featuring Uzbek patterns, landmarks, and society designs.",
    fullDescription: `Decorate your laptop, water bottle, or notebook with these beautiful stickers celebrating Uzbek culture and UzSoc!

## What's Included

Your pack contains 10 unique die-cut stickers:

### Landmarks (4 stickers)
- Registan Square, Samarkand
- Kalyan Minaret, Bukhara
- Chorsu Bazaar, Tashkent
- Itchan Kala, Khiva

### Patterns (3 stickers)
- Traditional ikat design
- Geometric Uzbek tiles
- Suzani embroidery motif

### UzSoc Designs (3 stickers)
- UzSoc logo
- "I ❤️ Plov" 
- Uzbek flag heart

## Quality

These aren't your average stickers:
- Waterproof vinyl material
- Fade-resistant inks
- Die-cut to shape
- Durable matte finish
- Average size: 5-7cm

## Perfect For

- Laptops and tablets
- Water bottles
- Notebooks and planners
- Phone cases
- Luggage and travel gear
- Room decorations

Share Uzbek culture wherever you go with these fun, colorful stickers!`,
    sizes: ["Pack of 10"],
    color: "bg-accent",
    bestseller: false,
    category: "Stickers",
    features: [
      "10 unique designs",
      "Waterproof vinyl",
      "Die-cut shapes",
      "Fade-resistant"
    ]
  },
  {
    id: 6,
    slug: "uzsoc-crewneck",
    name: "UzSoc Crewneck",
    price: "£30",
    description: "Classic crewneck sweatshirt with embroidered logo. A timeless wardrobe staple.",
    fullDescription: `The wardrobe essential everyone needs! Our classic crewneck sweatshirt combines comfort with style, featuring our embroidered logo for a premium look.

## Design

Timeless and versatile:
- Embroidered UzSoc logo on chest
- Clean, minimalist aesthetic
- Classic crewneck silhouette
- Ribbed cuffs and hem
- No hood for a cleaner look

## Quality

Built for comfort and longevity:
- 80% cotton, 20% polyester blend
- 260 GSM mid-weight fabric
- Brushed fleece interior
- Double-needle stitching
- Pre-shrunk to minimize shrinkage

## Fit

Relaxed fit that's not too baggy. Perfect for layering over shirts or wearing on its own.

## Styling

This versatile piece works with everything:
- Smart casual with chinos
- Relaxed with jeans
- Layer under a coat
- Weekend coffee runs
- Study sessions in the library

## Why Choose Crewneck?

The crewneck offers a cleaner, more refined look than a hoodie while maintaining the same comfort level. Perfect for those who prefer a more understated style.

Elevate your campus wardrobe with this essential piece!`,
    sizes: ["S", "M", "L", "XL"],
    color: "bg-primary",
    bestseller: false,
    category: "Clothing",
    features: [
      "Embroidered logo",
      "Mid-weight 260 GSM fabric",
      "Brushed fleece interior",
      "Ribbed cuffs and hem"
    ],
    careInstructions: [
      "Machine wash cold",
      "Tumble dry low",
      "Do not bleach",
      "Do not iron on logo"
    ]
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};
