import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;
    fetch("/404.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch(() => setAnimationData(null));
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <SEO title="404 | Page Not Found" />
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent/60 py-14 md:py-20">
        <div className="absolute inset-0 pointer-events-none uzbek-pattern opacity-15" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="mx-auto max-w-md">
              {animationData ? (
                <Lottie animationData={animationData} loop autoPlay />
              ) : (
                <div className="text-6xl font-black">404</div>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black">Page not found</h1>
            <p className="font-body text-lg text-foreground/80">
              The page you’re looking for doesn’t exist or may have moved. Let’s get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link to="/">Return Home</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-[3px] border-foreground">
                <Link to="/events">View Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
