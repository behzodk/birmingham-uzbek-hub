import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "@/services/newsService";

const News = () => {
  const { data: newsArticles = [], isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  const featuredArticle = newsArticles.find((a) => a.featured);
  const regularArticles = newsArticles;

  return (
    <Layout>
      {/* Hero Section - Storytelling Theme */}
      <section className="relative bg-coral overflow-hidden py-16 md:py-24">
        {/* Animated decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating paper shape */}
          <div className="absolute top-12 md:top-16 right-[5%] md:right-[8%] animate-float">
            <div className="w-14 h-20 md:w-20 md:h-28 bg-background border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] -rotate-6">
              <div className="p-2 space-y-1">
                <div className="h-1 bg-foreground/30 w-full" />
                <div className="h-1 bg-foreground/30 w-3/4" />
                <div className="h-1 bg-foreground/30 w-5/6" />
              </div>
            </div>
          </div>
          
          {/* Spinning decorative square */}
          <div className="absolute bottom-20 left-[10%] w-8 h-8 md:w-12 md:h-12 border-[2px] border-foreground/30 animate-spin-slow hidden md:block" style={{ animationDuration: '20s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="neo-badge bg-background text-foreground mb-4 inline-block text-sm">
              <User className="h-3 w-3 inline mr-1" />
              Latest Blog
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
              Stories & <span className="text-stroke text-transparent">Voices</span>
            </h1>
            <p className="font-body text-base md:text-xl text-coral-foreground/90 max-w-xl">
              The latest updates, stories, and announcements from our community. Like the ancient storytellers of the Silk Road. 📜
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {isLoading ? (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="neo-card bg-card p-8 md:p-12 flex items-center justify-center min-h-[220px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          </div>
        </section>
      ) : featuredArticle ? (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="neo-card bg-card overflow-hidden">
              <div className="grid lg:grid-cols-[1.2fr_1.8fr]">
                <div className="relative border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-foreground">
                  <div className={`${featuredArticle.color} absolute inset-0`} />
                  {featuredArticle.image && (
                    <div className="relative p-6 md:p-8 h-full">
                      <div className="h-full w-full border-[3px] border-foreground bg-background shadow-[6px_6px_0px_0px_hsl(var(--foreground))] overflow-hidden">
                        <img
                          src={featuredArticle.image}
                          alt={featuredArticle.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {!featuredArticle.image && (
                    <div className="p-8 md:p-12 flex flex-col justify-center h-full">
                      <span className="neo-badge bg-background text-foreground mb-4 inline-block w-fit">📰 Latest Blog</span>
                      <span className="neo-badge bg-foreground text-background mb-2 inline-block w-fit">{featuredArticle.category}</span>
                    </div>
                  )}
                </div>
                <div className="p-8 md:p-12">
                  <span className="neo-badge bg-background text-foreground mb-4 inline-block w-fit">📰 Latest Blog</span>
                  <span className="neo-badge bg-foreground text-background mb-2 inline-block w-fit">{featuredArticle.category}</span>
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
                  <Button asChild>
                    <Link to={`/blog/${featuredArticle.slug}`}>
                      Read Full Story
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* All Blog Posts */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold mb-8">All Stories</h2>
          {isLoading ? (
            <div className="neo-card bg-card p-8 flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
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
                  <Link 
                    to={`/blog/${article.slug}`}
                    className="font-display text-primary hover:text-primary/80 inline-flex items-center"
                  >
                    Read More →
                  </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          {!isLoading && regularArticles.length === 0 && (
            <div className="neo-card bg-card p-6 mt-6">
              <p className="font-body text-muted-foreground">No posts published yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="neo-card bg-primary p-8 md:p-12 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Stay in the Loop!
            </h2>
            <p className="font-body text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Subscribe to our blog for updates on events, stories, and exclusive member content.
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
