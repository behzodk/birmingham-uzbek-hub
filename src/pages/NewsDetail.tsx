import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { getArticleBySlug, newsArticles } from "@/data/newsData";

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <h1 className="font-display text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="font-body text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/news")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </div>
      </Layout>
    );
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = newsArticles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 2);

  // Parse markdown-like content to JSX
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    let blockquote: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-6 font-body text-foreground/90">
            {listItems.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
        listItems = [];
      }
    };

    const flushBlockquote = () => {
      if (blockquote.length > 0) {
        elements.push(
          <blockquote key={`quote-${elements.length}`} className="border-l-4 border-primary pl-4 py-2 mb-6 italic font-body text-muted-foreground bg-muted/50">
            {blockquote.map((line, i) => <p key={i}>{line}</p>)}
          </blockquote>
        );
        blockquote = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('## ')) {
        flushList();
        flushBlockquote();
        elements.push(
          <h2 key={index} className="font-display text-2xl font-bold mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        flushBlockquote();
        elements.push(
          <h3 key={index} className="font-display text-xl font-bold mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ')) {
        flushBlockquote();
        listItems.push(trimmed.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1'));
      } else if (trimmed.match(/^\d+\./)) {
        flushBlockquote();
        listItems.push(trimmed.replace(/^\d+\.\s*/, ''));
      } else if (trimmed.startsWith('> ')) {
        flushList();
        blockquote.push(trimmed.replace('> ', ''));
      } else if (trimmed === '') {
        flushList();
        flushBlockquote();
      } else {
        flushList();
        flushBlockquote();
        // Handle bold text
        const formattedText = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        elements.push(
          <p 
            key={index} 
            className="font-body text-lg text-foreground/90 mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      }
    });

    flushList();
    flushBlockquote();
    return elements;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`relative ${article.color} overflow-hidden py-12 md:py-20`}>
        {/* Decorative spinning shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 right-[10%] w-8 h-8 md:w-12 md:h-12 border-[2px] border-foreground/20 animate-spin-slow" style={{ animationDuration: '15s' }} />
          <div className="absolute bottom-12 left-[8%] w-6 h-6 md:w-10 md:h-10 border-[2px] border-foreground/20 rotate-45 animate-spin-slow" style={{ animationDuration: '20s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-background/20"
            onClick={() => navigate("/news")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>

          <div className="max-w-3xl">
            <span className="neo-badge bg-foreground text-background mb-4 inline-block">
              {article.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 font-body text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-auto neo-card"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {renderContent(article.content)}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t-[3px] border-foreground">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  <span className="font-display font-bold">Share this story</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold mb-8">Related Stories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link 
                  key={related.id} 
                  to={`/news/${related.slug}`}
                  className="neo-card bg-card overflow-hidden group hover:translate-y-[-2px] transition-transform"
                >
                  <div className={`${related.color} p-4 border-b-[3px] border-foreground`}>
                    <span className="neo-badge bg-background text-foreground text-xs">{related.category}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    <p className="font-body text-foreground/80 line-clamp-2">{related.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to News CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Button onClick={() => navigate("/news")} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            View All News
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;
