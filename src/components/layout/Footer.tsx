import { Link } from "react-router-dom";
import { Instagram, Send, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t-[3px] border-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-secondary border-[3px] border-foreground flex items-center justify-center shadow-[3px_3px_0px_0px_hsl(var(--foreground))]">
                <span className="text-secondary-foreground font-display font-bold text-lg">
                  U
                </span>
              </div>
              <span className="font-display font-bold text-xl">
                Uzbek Society
              </span>
            </div>

            <p className="font-body text-primary-foreground/80">
              Founded by students, run by students.
            </p>

            <p className="mt-2 font-body text-sm text-primary-foreground/60">
              A home away from home in Birmingham.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 font-body">
              <li>
                <Link to="/events" className="hover:text-secondary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-secondary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">
              Stay Connected
            </h3>
            <div className="flex gap-3">
              {/* Telegram */}
              <a
                href="https://t.me/uobuzbeksoc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary border-[3px] border-foreground flex items-center justify-center shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <Send className="h-5 w-5 text-secondary-foreground" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/uobuzbeksoc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent border-[3px] border-foreground flex items-center justify-center shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <Instagram className="h-5 w-5 text-accent-foreground" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/uobuzbeksoc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-coral border-[3px] border-foreground flex items-center justify-center shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <Linkedin className="h-5 w-5 text-coral-foreground" />
              </a>
            </div>

            <p className="mt-4 font-body text-sm text-primary-foreground/80">
              uzbeksociety@guild.bham.ac.uk
            </p>
          </div>
        </div>

        <div className="border-t-[3px] border-primary-foreground/20 mt-8 pt-8 text-center font-body text-sm text-primary-foreground/60">
          <p>© 2026 Uzbek Society, University of Birmingham. Made with 💙</p>
        </div>
      </div>
    </footer>
  );
}
