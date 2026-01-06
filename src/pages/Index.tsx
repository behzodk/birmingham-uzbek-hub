import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { AboutPreview } from "@/components/home/AboutPreview";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Marquee />
      <FeaturedEvents />
      <AboutPreview />
    </Layout>
  );
};

export default Index;
