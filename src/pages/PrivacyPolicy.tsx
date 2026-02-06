import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, Mail, FileText, Globe2, Clock3, Database, Camera } from "lucide-react";

const privacyPoints = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Who we are",
    body: "Uzbek Society of the University of Birmingham (student-run society, UK). Contact: uzbeksociety@guild.bham.ac.uk. Data controller for the personal data we collect via this site and our events forms.",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "What we collect",
    body: "Name, student email (@student.bham.ac.uk), student ID, role preferences, form answers, event registrations, correspondence, and optional feedback. Photos/video at events may capture attendees.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Why we collect",
    body: "Run registrations, allocate roles, send event logistics, maintain attendance records, improve programming, and meet guild/university safeguarding requirements.",
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Legal bases (UK GDPR)",
    body: "Consent (sign-ups, marketing opt-ins), contract/legitimate interest (managing events you register for), and legal obligation (safety/incident records if required).",
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Sharing",
    body: "We use trusted processors: Supabase (hosting/forms/database), email tools, analytics, and UoB Guild/University officials when needed for safety, venue access, or compliance. We do not sell data.",
  },
  {
    icon: <Clock3 className="h-5 w-5" />,
    title: "Retention",
    body: "Event sign-up data: kept for the academic year plus one additional year for reporting; incident/safety records may be kept longer if legally required. Photos may be reused for society promotion until you object.",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Your choices",
    body: "You can access, correct, delete, or object to processing of your data. Withdraw consent or unsubscribe at any time by emailing uzbeksociety@guild.bham.ac.uk. We respond within one month.",
  },
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Photos & media",
    body: "We take photos/videos at events for community updates. Tell an organizer or email us to opt out or request removal when feasible.",
  },
];

const PrivacyPolicy = () => {
  return (
    <Layout>
      <SEO title="Privacy Policy | Uzbek Society" description="How Uzbek Society at the University of Birmingham handles your data." />
      <section className="relative overflow-hidden bg-secondary py-14 md:py-20">
        <div className="absolute inset-0 pointer-events-none uzbek-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10 space-y-4">
          <span className="neo-badge bg-background text-foreground">Privacy & Data Protection</span>
          <h1 className="font-display text-4xl md:text-5xl font-black">Privacy Policy</h1>
          <p className="font-body text-secondary-foreground/80 max-w-3xl">
            How we collect, use, and protect your information as members and guests of the Uzbek Society at the University of Birmingham.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 space-y-10">
          <div className="neo-card bg-card border-[4px] border-foreground shadow-[10px_10px_0px_0px_hsl(var(--foreground))] p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              {privacyPoints.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="mt-1 h-10 w-10 rounded-xl border-[3px] border-foreground bg-muted grid place-items-center">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold">{item.title}</h3>
                    <p className="font-body text-foreground/80 text-sm md:text-base">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="neo-card bg-muted border-[4px] border-foreground p-6 md:p-8 space-y-3">
              <h2 className="font-display text-2xl font-bold">Details we collect</h2>
              <ul className="list-disc pl-5 space-y-2 font-body text-foreground/80">
                <li>Identity & contact: full name, student email (@student.bham.ac.uk), optional phone, student ID.</li>
                <li>Event/form data: role preference (debater/observer), topic selections, accessibility needs, attendance confirmations.</li>
                <li>Technical: basic logs from our website host for reliability and abuse prevention (IP, device/browser). No invasive tracking or advertising cookies.</li>
                <li>Media: photos/videos at events where you are present.</li>
              </ul>
            </div>

            <div className="neo-card bg-muted border-[4px] border-foreground p-6 md:p-8 space-y-3">
              <h2 className="font-display text-2xl font-bold">How we use your data</h2>
              <ul className="list-disc pl-5 space-y-2 font-body text-foreground/80">
                <li>Register you for society events and confirm attendance.</li>
                <li>Communicate logistics, changes, or emergencies related to the events you join.</li>
                <li>Plan capacity, roles, and materials based on registrations and preferences.</li>
                <li>Share summaries with the Guild/University when required for safeguarding or venue access.</li>
                <li>Feature anonymised stats or event highlights to improve programming.</li>
              </ul>
            </div>
          </div>

          <div className="neo-card bg-card border-[4px] border-foreground p-6 md:p-8 space-y-4">
            <h2 className="font-display text-2xl font-bold">Legal bases & international transfers</h2>
            <p className="font-body text-foreground/80">
              We operate under UK GDPR. Primary bases: consent (sign-ups, optional marketing), legitimate interest (running events you register for), and legal obligation (safety/incident records if requested by the University or authorities). Our main systems are UK/EU-hosted where possible; Supabase may process data in the EU/US using Standard Contractual Clauses. We do not sell data.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="neo-card bg-muted border-[4px] border-foreground p-6 md:p-8 space-y-3">
              <h2 className="font-display text-2xl font-bold">Your rights (UK GDPR)</h2>
              <ul className="list-disc pl-5 space-y-2 font-body text-foreground/80">
                <li>Access and portability of your data.</li>
                <li>Correction of inaccurate details.</li>
                <li>Deletion (“right to be forgotten”) where applicable.</li>
                <li>Restriction or objection to processing, including marketing opt-outs.</li>
                <li>Withdraw consent at any time without affecting prior lawful use.</li>
                <li>Complain to the UK ICO if unresolved: ico.org.uk.</li>
              </ul>
            </div>

            <div className="neo-card bg-muted border-[4px] border-foreground p-6 md:p-8 space-y-3">
              <h2 className="font-display text-2xl font-bold">Security & retention</h2>
              <ul className="list-disc pl-5 space-y-2 font-body text-foreground/80">
                <li>Access limited to committee members who need it.</li>
                <li>Supabase authentication, role-based access, and encrypted transit/storage.</li>
                <li>Data minimised and reviewed annually; routine event data deleted after academic year + 1 year.</li>
                <li>Incident or safeguarding records may be retained longer if required by law or University policy.</li>
              </ul>
            </div>
          </div>

          <div className="neo-card bg-card border-[4px] border-foreground p-6 md:p-8 space-y-3">
            <h2 className="font-display text-2xl font-bold">Cookies & analytics</h2>
            <p className="font-body text-foreground/80">
              We currently use only essential cookies/technical logs for performance and security. If we add analytics or marketing cookies in the future, we will update this policy and provide a consent banner.
            </p>
          </div>

          <div className="neo-card bg-card border-[4px] border-foreground p-6 md:p-8 space-y-3">
            <h2 className="font-display text-2xl font-bold">Contact</h2>
            <p className="font-body text-foreground/80">
              Email uzbeksociety@guild.bham.ac.uk for any privacy questions, data requests, or to withdraw consent. We aim to reply within one month.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                Back to top
              </Button>
              <Button variant="outline" className="border-[3px] border-foreground" asChild>
                <a href="mailto:uzbeksociety@guild.bham.ac.uk">Email the committee</a>
              </Button>
            </div>
            <p className="font-body text-xs text-muted-foreground">Last updated: 06 February 2026</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
