import type { ReactNode } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";

export interface LegalSection { id: string; title: string; content: ReactNode }
export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return <Layout><SEO title={title} description={intro} />
    <main className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
      <header className="mb-8 space-y-4"><p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">UzbekSoc · Policies</p><h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1><p className="max-w-3xl leading-relaxed text-muted-foreground">{intro}</p><p className="text-sm text-muted-foreground">Last updated: 17 November 2026 · Version 2026-11-17</p></header>
      <div className="grid gap-10 md:grid-cols-[200px_minmax(0,1fr)]"><nav aria-label="On this page" className="self-start md:sticky md:top-24"><p className="mb-3 font-semibold">On this page</p><ol className="space-y-3 text-sm">{sections.map(s=><li key={s.id}><a className="underline decoration-border underline-offset-4 hover:decoration-current" href={`#${s.id}`}>{s.title}</a></li>)}</ol></nav>
      <div className="min-w-0 space-y-9">{sections.map(s=><section key={s.id} id={s.id} className="scroll-mt-28 border-b border-border pb-8"><h2 className="mb-4 font-display text-2xl font-bold">{s.title}</h2><div className="space-y-4 text-sm leading-7 md:text-base">{s.content}</div></section>)}</div></div>
      <div className="mt-10 flex gap-6 text-sm"><Link className="underline" to="/privacy">Privacy Policy</Link><Link className="underline" to="/terms">Website and Event Terms</Link></div>
    </main></Layout>;
}
export const PrivacyContact = () => <a className="underline" href="mailto:uzbeksociety@guild.bham.ac.uk">uzbeksociety@guild.bham.ac.uk</a>;
