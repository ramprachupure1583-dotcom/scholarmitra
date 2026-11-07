import Link from "next/link";
import {
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const IMPORTANT_LINKS = [
  { name: "National Scholarship Portal", href: "https://scholarships.gov.in" },
  { name: "UP Scholarship Portal", href: "https://scholarship.up.gov.in" },
  { name: "MahaDBT (Maharashtra)", href: "https://mahadbt.maharashtra.gov.in" },
  { name: "Digital Gujarat", href: "https://www.digitalgujarat.gov.in" },
  { name: "Jnanabhumi (AP)", href: "https://jnanabhumi.ap.gov.in" },
  { name: "SSP Karnataka", href: "https://ssp.postmatric.karnataka.gov.in" },
];

const CATEGORIES = [
  { name: "School Scholarships", href: "/explore?school=true" },
  { name: "Undergraduate Scholarships", href: "/explore?level=ug" },
  { name: "Postgraduate Scholarships", href: "/explore?level=pg" },
  { name: "Merit-Based Scholarships", href: "/explore?kind=merit" },
  { name: "Need-Based Scholarships", href: "/explore?kind=need" },
  { name: "State Government Schemes", href: "/explore?authority=state" },
  { name: "Central Government Schemes", href: "/explore?authority=central" },
];

const QUICK = [
  { name: "Home", href: "/" },
  { name: "Explore Scholarships", href: "/explore" },
  { name: "Eligibility Checker", href: "/eligibility" },
  { name: "Compare Scholarships", href: "/compare" },
  { name: "About Us", href: "/about" },
  { name: "Contact & Support", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-blue-950 text-blue-100">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(60rem_30rem_at_85%_-10%,rgba(59,130,246,0.35),transparent_60%),radial-gradient(40rem_20rem_at_0%_110%,rgba(99,102,241,0.25),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/90 text-white">
                <GraduationCap className="h-5.5 w-5.5" />
              </span>
              <div className="leading-none">
                <p className="text-lg font-extrabold tracking-tight text-white">
                  Scholar<span className="text-blue-400">Mitra</span>
                </p>
                <p className="mt-1 text-[11px] text-blue-300">Your dream deserves support</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-blue-200/80">
              ScholarMitra helps Indian students discover verified Central and State Government
              scholarships, check eligibility, track deadlines and prepare documents — always
              linking back to official government portals to apply.
            </p>
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-blue-800/60 bg-blue-900/40 p-4 text-xs leading-relaxed text-blue-200/80">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
              <p>
                ScholarMitra is an independent discovery platform — not a government website, and
                not affiliated with any government body. Applications always happen on official
                portals, and scholarship applications are always free of cost.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-blue-200/80 transition hover:text-white">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              Scholarship Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-blue-200/80 transition hover:text-white">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              Official Portals
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {IMPORTANT_LINKS.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-blue-200/80 transition hover:text-white"
                  >
                    {l.name}
                    <ExternalLink className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 text-sm text-blue-200/80">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-300" /> support@scholarmitra.in
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-300" /> New Delhi, India
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-blue-800/50 pt-6 text-xs text-blue-300/80 sm:flex-row">
          <p>© {new Date().getFullYear()} ScholarMitra. Made with care for India's students.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
