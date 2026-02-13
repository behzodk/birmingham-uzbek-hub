import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Star, CheckCircle, Shirt } from "lucide-react";
import { getProductBySlug, products } from "@/data/merchData";

const MerchStoreDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <h1 className="font-display text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="font-body text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/merch")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Merch
          </Button>
        </div>
      </Layout>
    );
  }

  // Get related products (same category, excluding current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Parse markdown-like content to JSX
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];

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

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="font-display text-2xl font-bold mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="font-display text-xl font-bold mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ')) {
        listItems.push(trimmed.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1'));
      } else if (trimmed === '') {
        flushList();
      } else {
        flushList();
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
    return elements;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/merch")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Merch
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className={`${product.color} neo-card aspect-square flex items-center justify-center relative`}>
              <ShoppingBag className="w-32 h-32 opacity-20" />
              {product.bestseller && (
                <div className="absolute top-4 right-4 neo-badge bg-coral text-coral-foreground flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Bestseller
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <span className="neo-badge bg-muted text-foreground mb-4 inline-block">
                {product.category}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>
              <p className="font-display text-3xl font-bold text-primary mb-6">
                {product.price}
              </p>
              <p className="font-body text-lg text-muted-foreground mb-8">
                {product.description}
              </p>

              {/* Sizes */}
              <div className="mb-8">
                <h3 className="font-display font-bold mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className="px-4 py-2 border-[3px] border-foreground font-body hover:bg-primary hover:text-primary-foreground transition-colors shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="flex-1">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Features */}
              {product.features && (
                <div className="neo-card bg-muted p-6 mb-6">
                  <h3 className="font-display font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Features
                  </h3>
                  <ul className="space-y-2 font-body text-sm">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Care Instructions */}
              {product.careInstructions && (
                <div className="neo-card bg-card p-6">
                  <h3 className="font-display font-bold mb-3 flex items-center gap-2">
                    <Shirt className="h-5 w-5 text-primary" />
                    Care Instructions
                  </h3>
                  <ul className="space-y-2 font-body text-sm">
                    {product.careInstructions.map((instruction, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Full Description */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">About This Product</h2>
            <div className="prose prose-lg max-w-none">
              {renderContent(product.fullDescription)}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/merch/${related.slug}`}
                  className="neo-card bg-card overflow-hidden group hover:translate-y-[-2px] transition-transform"
                >
                  <div className={`${related.color} aspect-square border-b-[3px] border-foreground flex items-center justify-center relative`}>
                    <ShoppingBag className="w-16 h-16 opacity-20" />
                    {related.bestseller && (
                      <div className="absolute top-3 right-3 neo-badge bg-coral text-coral-foreground text-xs flex items-center gap-1">
                        <Star className="h-2 w-2 fill-current" />
                        Best
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display font-bold group-hover:text-primary transition-colors">
                        {related.name}
                      </h3>
                      <span className="font-display font-bold text-primary">{related.price}</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground line-clamp-2">{related.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Merch CTA */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <Button onClick={() => navigate("/merch")} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            View All Products
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default MerchStoreDetail;
