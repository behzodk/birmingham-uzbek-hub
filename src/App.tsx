import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import EventPhotos from "./pages/EventPhotos";
import PastEvents from "./pages/PastEvents";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import FormDetail from "./pages/FormDetail";
import FormFilled from "./pages/FormFilled";
import FormInactive from "./pages/FormInactive";
import FormSuccess from "./pages/FormSuccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { ScrollToTop } from "./components/ScrollToTop";
import MerchStore from "./pages/MerchStore";
import MerchStoreDetail from "./pages/MerchStoreDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Competitions from "./pages/Competitions";
import CompetitionDetail from "./pages/CompetitionDetail";
import CompetitionLeaderboardPage from "./pages/CompetitionLeaderboard";
import CompetitionRate from "./pages/CompetitionRate";
import CompetitionRegister from "./pages/CompetitionRegister";
import CompetitionRegistrationSuccess from "./pages/CompetitionRegistrationSuccess";

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
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/past" element={<PastEvents />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/events/:slug/photos" element={<EventPhotos />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/rate/:ratingPublicId" element={<CompetitionRate />} />
            <Route path="/competitions/:slug/register" element={<CompetitionRegister />} />
            <Route path="/competitions/:slug/registered/:ratingId" element={<CompetitionRegistrationSuccess />} />
            <Route path="/competitions/:slug/leaderboard" element={<CompetitionLeaderboardPage />} />
            <Route path="/competitions/:slug" element={<CompetitionDetail />} />
            <Route path="/forms/:slug" element={<FormDetail />} />
            <Route path="/forms/:slug/inactive" element={<FormInactive />} />
            <Route path="/forms/:slug/filled" element={<FormFilled />} />
            <Route path="/forms/:slug/success" element={<FormSuccess />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<News />} />
            <Route path="/blog/:slug" element={<NewsDetail />} />
            <Route path="/news" element={<BlogRedirect />} />
            <Route path="/news/:slug" element={<BlogRedirect />} />
            <Route path="/merch" element={<MerchStore />} />
            <Route path="/merch/:slug" element={<MerchStoreDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
