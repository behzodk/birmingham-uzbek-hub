import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";

const newsArticles = [
  {
    id: 1,
    title: "UzSoc Wins Best Cultural Society Award 2025!",
    excerpt: "We're thrilled to announce that the Uzbek Society has been recognized as the Best Cultural Society at the Guild Awards. Thank you to all our amazing members!",
    author: "Committee",
    date: "December 15, 2025",
    category: "Announcement",
    color: "bg-secondary",
    featured: true,
  },
  {
    id: 2,
    title: "Recap: Our Incredible Navruz 2025 Celebration",
    excerpt: "Over 250 guests joined us for an unforgettable evening of traditional food, music, and dancing. Check out the highlights and photos from the night!",
    author: "Events Team",
    date: "March 25, 2025",
    category: "Event Recap",
    color: "bg-accent",
    featured: false,
  },
  {
    id: 3,
    title: "New Partnership with Uzbek Embassy",
    excerpt: "We're excited to announce our new partnership with the Embassy of Uzbekistan in London, opening doors for cultural exchanges and special events.",
    author: "President",
    date: "November 10, 2025",
    category: "Partnership",
    color: "bg-primary",
    featured: false,
  },
  {
    id: 4,
    title: "Volunteer Spotlight: Meet Our Amazing Team",
    excerpt: "Behind every great event is a team of dedicated volunteers. This month, we're highlighting the incredible people who make UzSoc special.",
    author: "Media Team",
    date: "October 28, 2025",
    category: "Community",
    color: "bg-coral",
    featured: false,
  },
  {
    id: 5,
    title: "Plov Recipe: Make It at Home!",
    excerpt: "By popular demand, we're sharing our secret plov recipe. Learn how to make this beloved Uzbek dish in your own kitchen with our step-by-step guide.",
    author: "Cultural Team",
    date: "October 15, 2025",
    category: "Culture",
    color: "bg-secondary",
    featured: false,
  },
  {
    id: 6,
    title: "Welcome Week 2025: A Huge Success",
    excerpt: "We welcomed over 100 new members during Welcome Week! From our stall to our first social, here's how we kicked off the academic year.",
    author: "Committee",
    date: "September 30, 2025",
    category: "Event Recap",
    color: "bg-accent",
    featured: false,
  },
];

const News = () => {
  const featuredArticle = newsArticles.find(a => a.featured);
  const regularArticles = newsArticles.filter(a => !a.featured);

  return (
    <Layout>
      {/* Hero Section - Storytelling/Manuscript Theme */}
      <section className="relative bg-coral overflow-hidden py-24">
        {/* Animated decorative elements - paper/manuscript motif */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating paper/scroll shapes */}
          <div className="absolute top-16 right-[8%] animate-float">
            <div className="w-20 h-28 bg-background border-[3px] border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -rotate-6">
              <div className="p-2 space-y-1">
                <div className="h-1 bg-foreground/30 w-full" />
                <div className="h-1 bg-foreground/30 w-3/4" />
                <div className="h-1 bg-foreground/30 w-5/6" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-20 left-[12%] animate-float hidden md:block" style={{ animationDelay: '1.2s' }}>
            <div className="w-16 h-20 bg-secondary border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-12">
              <div className="p-2 space-y-1">
                <div className="h-1 bg-foreground/40 w-full" />
                <div className="h-1 bg-foreground/40 w-2/3" />
              </div>
            </div>
          </div>
          <div className="absolute top-28 left-[25%] animate-float hidden lg:block" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-12 bg-accent border-[3px] border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] rotate-45">
              <span className="flex items-center justify-center h-full text-lg -rotate-45">📰</span>
            </div>
          </div>
          
          {/* Ink splatter-style decorative dots */}
          <div className="absolute top-1/2 right-[20%] w-3 h-3 rounded-full bg-foreground/20 animate-pulse" />
          <div className="absolute top-1/3 right-[30%] w-2 h-2 rounded-full bg-foreground/15 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/3 left-[35%] w-4 h-4 rounded-full bg-foreground/10 animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Decorative quill line */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-2">
            <div className="w-32 h-1 bg-foreground/20 animate-pulse" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="neo-badge bg-background text-foreground mb-4 inline-block">
              <User className="h-3 w-3 inline mr-1" />
              Stay Updated
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Stories & <span className="text-stroke text-transparent">Voices</span>
            </h1>
            <p className="font-body text-xl text-coral-foreground/90 max-w-xl">
              The latest updates, stories, and announcements from our community. Like the ancient storytellers of the Silk Road. 📜
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="neo-card bg-card overflow-hidden">
              <div className="grid md:grid-cols-5">
                <div className={`${featuredArticle.color} md:col-span-2 p-8 md:p-12 border-b-[3px] md:border-b-0 md:border-r-[3px] border-foreground flex flex-col justify-center`}>
                  <span className="neo-badge bg-background text-foreground mb-4 inline-block w-fit">📰 Latest News</span>
                  <span className="neo-badge bg-foreground text-background mb-2 inline-block w-fit">{featuredArticle.category}</span>
                </div>
                <div className="md:col-span-3 p-8 md:p-12">
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">{featuredArticle.title}</h2>
                  <div className="flex items-center gap-4 mb-4 font-body text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredArticle.date}</span>
                    </div>
                  </div>
                  <p className="font-body text-lg text-muted-foreground mb-6">{featuredArticle.excerpt}</p>
                  <Button>
                    Read Full Story
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All News */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold mb-8">All Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <article key={article.id} className="neo-card bg-card overflow-hidden group">
                <div className={`${article.color} p-4 border-b-[3px] border-foreground`}>
                  <span className="neo-badge bg-background text-foreground text-xs">{article.category}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-4 font-body text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <p className="font-body text-foreground/80 mb-4 line-clamp-3">{article.excerpt}</p>
                  <Button variant="ghost" className="p-0 h-auto font-display text-primary hover:text-primary/80">
                    Read More →
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="neo-card bg-primary p-8 md:p-12 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Stay in the Loop!
            </h2>
            <p className="font-body text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter for updates on events, news, and exclusive member content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your.email@bham.ac.uk"
                className="flex-1 px-4 py-3 border-[3px] border-foreground font-body bg-background text-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;
