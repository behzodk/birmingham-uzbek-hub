import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "UzSoc Classic Hoodie",
    price: "£35",
    description: "Premium quality hoodie featuring our iconic logo. Warm, cozy, and perfect for campus life.",
    sizes: ["S", "M", "L", "XL"],
    color: "bg-primary",
    bestseller: true,
  },
  {
    id: 2,
    name: "Uzbekistan Flag Tee",
    price: "£18",
    description: "Soft cotton t-shirt with a stylized Uzbek flag design. Show your pride!",
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: "bg-accent",
    bestseller: false,
  },
  {
    id: 3,
    name: "Doppi Beanie",
    price: "£15",
    description: "Modern beanie inspired by traditional Uzbek doppi patterns. Keep warm in style!",
    sizes: ["One Size"],
    color: "bg-secondary",
    bestseller: true,
  },
  {
    id: 4,
    name: "UzSoc Tote Bag",
    price: "£12",
    description: "Sturdy canvas tote with our logo. Perfect for books, groceries, or everything in between.",
    sizes: ["One Size"],
    color: "bg-coral",
    bestseller: false,
  },
  {
    id: 5,
    name: "Silk Road Sticker Pack",
    price: "£5",
    description: "Set of 10 unique stickers featuring Uzbek patterns, landmarks, and society designs.",
    sizes: ["Pack of 10"],
    color: "bg-accent",
    bestseller: false,
  },
  {
    id: 6,
    name: "UzSoc Crewneck",
    price: "£30",
    description: "Classic crewneck sweatshirt with embroidered logo. A timeless wardrobe staple.",
    sizes: ["S", "M", "L", "XL"],
    color: "bg-primary",
    bestseller: false,
  },
];

const Merch = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary uzbek-pattern py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="neo-badge bg-primary text-primary-foreground mb-4 inline-block">Rep the Soc</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">Merch</h1>
            <p className="font-body text-xl text-secondary-foreground/80">
              Wear your pride! Official UzSoc merchandise designed with love and Uzbek flair.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="default">All Items</Button>
            <Button variant="outline">Clothing</Button>
            <Button variant="outline">Accessories</Button>
            <Button variant="outline">Stickers</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="neo-card bg-card overflow-hidden group">
                {/* Product Image Placeholder */}
                <div className={`${product.color} aspect-square border-b-[3px] border-foreground relative flex items-center justify-center`}>
                  <ShoppingBag className="w-20 h-20 opacity-20" />
                  {product.bestseller && (
                    <div className="absolute top-4 right-4 neo-badge bg-coral text-coral-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Bestseller
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-xl font-bold">{product.name}</h3>
                    <span className="font-display text-xl font-bold text-primary">{product.price}</span>
                  </div>
                  <p className="font-body text-muted-foreground mb-4">{product.description}</p>

                  {/* Sizes */}
                  <div className="mb-4">
                    <span className="font-body text-sm text-muted-foreground mb-2 block">Sizes:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="px-3 py-1 border-2 border-foreground font-body text-sm hover:bg-muted cursor-pointer transition-colors"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" variant="default">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="neo-card bg-card p-6 text-center">
              <div className="w-16 h-16 bg-secondary border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-2">Collection on Campus</h3>
              <p className="font-body text-muted-foreground text-sm">
                Pick up your order at our weekly events or the Guild shop
              </p>
            </div>
            <div className="neo-card bg-card p-6 text-center">
              <div className="w-16 h-16 bg-accent border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💙</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-2">Supports the Society</h3>
              <p className="font-body text-muted-foreground text-sm">
                All proceeds go towards funding our events and activities
              </p>
            </div>
            <div className="neo-card bg-card p-6 text-center">
              <div className="w-16 h-16 bg-coral border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-2">Quality Guaranteed</h3>
              <p className="font-body text-muted-foreground text-sm">
                Premium materials and prints that last wash after wash
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-order CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="neo-card bg-primary p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  Navruz 2026 Limited Edition Coming Soon!
                </h2>
                <p className="font-body text-primary-foreground/80">
                  Special collection dropping in February. Join the waitlist to get early access.
                </p>
              </div>
              <Button variant="secondary" size="lg" className="shrink-0">
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Merch;
