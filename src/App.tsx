import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import PastEvents from "./pages/PastEvents";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
// import Merch from "./pages/Merch";
// import MerchDetail from "./pages/MerchDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const BlogRedirect = () => {
  const { slug } = useParams<{ slug?: string }>();
  return <Navigate to={slug ? `/blog/${slug}` : "/blog"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/past" element={<PastEvents />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/blog" element={<News />} />
            <Route path="/blog/:slug" element={<NewsDetail />} />
            <Route path="/news" element={<BlogRedirect />} />
            <Route path="/news/:slug" element={<BlogRedirect />} />
            {/* <Route path="/merch" element={<Merch />} />
            <Route path="/merch/:slug" element={<MerchDetail />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
