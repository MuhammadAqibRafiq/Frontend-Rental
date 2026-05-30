"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { logoutAction } from "@/controllers/auth.controller";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const PROBLEMS = [
  { icon: "book",  title: "Billing books cost you money — every single month", body: "150 here, 200 there. By the end of the year, you've spent more on the books than you'd pay for half a year of software.", accent: "#a78bfa" },
  { icon: "clock", title: "30+ minutes wasted writing bills by hand", body: "Copy the address. Copy the meter reading. Add the numbers. Tear out the carbon copy. Now do that for every tenant, every month.", accent: "#34d399" },
  { icon: "alert", title: "One math error and the dispute starts", body: "A wrong total, an unreadable digit, a forgotten line item — and suddenly you're back and forth with the tenant for three days.", accent: "#f59e0b" },
];

const STEPS = [
  { n: "01", title: "Add your property", body: "Name, address, units. Takes 30 seconds. You only do this once.", grad: "linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%)", shadow: "0 20px 40px -10px rgba(124,58,237,0.5)" },
  { n: "02", title: "Add your tenants",  body: "Phone number, unit, rent, utility rates. Stored once, used forever.", grad: "linear-gradient(135deg,#14b8a6 0%,#5eead4 100%)", shadow: "0 20px 40px -10px rgba(20,184,166,0.5)" },
  { n: "03", title: "Generate & share",  body: "One click, one bill. Download the PDF or send it on WhatsApp — done.", grad: "linear-gradient(135deg,#10b981 0%,#6ee7b7 100%)", shadow: "0 20px 40px -10px rgba(16,185,129,0.5)" },
];

const FEATURES = [
  { icon: "bolt",      title: "Auto bill generation",   body: "Rent, electricity, gas, water, maintenance — itemised every month. You just confirm the meter reading.", color: "#10b981" },
  { icon: "pdf",       title: "Clean PDF downloads",    body: "Professional-looking bills, with your name on top. Print, archive, or attach to an email.", color: "#0ea5e9" },
  { icon: "whatsapp",  title: "WhatsApp sharing",       body: "One tap and the bill is in your tenant's chat. With a polite reminder message already typed.", color: "#25D366" },
  { icon: "history",   title: "Full bill history",      body: "Every bill, every payment, every tenant — searchable. No more flipping through old register pages.", color: "#8b5cf6" },
  { icon: "buildings", title: "Multi-property support", body: "Whether you own 1 flat or 25, everything sits in one dashboard with no extra setup.", color: "#f97316" },
  { icon: "phone",     title: "Works on your phone",    body: "Generate a bill while you're at the property. No laptop required — your phone is enough.", color: "#ec4899" },
];

const STATS = [
  { value: 500,   suffix: "+",   label: "Landlords on board", sub: "and growing every week" },
  { value: 10000, suffix: "+",   label: "Bills generated",    sub: "across 14 cities" },
  { value: 1200,  suffix: "hrs", label: "Saved this year",    sub: "vs. handwriting bills" },
];

const TESTIMONIALS = [
  { quote: "I used to spend my Sunday mornings filling out the billing book for 8 tenants. Now it takes me about 4 minutes. I genuinely don't know what I was doing before this.", name: "Bilal Ahmed",  role: "Owns 3 properties, Karachi",   initials: "BA", gradient: "linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%)" },
  { quote: "Tenants stopped questioning the totals once everything was printed clearly. The WhatsApp share is my favourite part — they actually read the bill now.",                 name: "Sana Malik",  role: "Owns 5 properties, Lahore",    initials: "SM", gradient: "linear-gradient(135deg,#ec4899 0%,#f9a8d4 100%)" },
  { quote: "Setup took me 20 minutes for all 12 tenants. I was expecting it to be complicated. It's not — that's the best compliment I can give.",                                  name: "Kashif Raza", role: "Owns 12 units, Islamabad",      initials: "KR", gradient: "linear-gradient(135deg,#10b981 0%,#6ee7b7 100%)" },
];

const TRUST_LOGOS = ["BrickWorks","Urbanstay","HomeFront","TenantPro","LeaseLine","PropDeck","FlatFolio","Hearth & Co."];

const FAQS = [
  { q: "Is it really free?",                    a: "Yes — RentalApp is free right now. No card, no trial timer, no hidden 'free up to X bills' limit. We'll always tell you well in advance if that changes." },
  { q: "Do my tenants need to install anything?",a: "Nope. They just receive the bill as a PDF on WhatsApp (or email) like any other message. They don't need accounts, apps, or logins." },
  { q: "What if I have only one property?",      a: "Perfect — that's actually the most common case. The whole flow is designed so that a single-property landlord is set up in under 5 minutes." },
  { q: "Can I customise what's on the bill?",    a: "Yes. You can add custom line items (parking, club fees, gym, anything), edit the previous month's reading, and add notes. The template adapts to what you put in." },
  { q: "Does it work without internet?",         a: "You need internet to generate and send a bill, but once a PDF is downloaded it's yours forever — sits in your phone or laptop, no login needed to open it later." },
  { q: "What about my data?",                    a: "Your tenant data stays in your account, encrypted, and never gets sold or shared. You can export everything to a spreadsheet any time, and delete it permanently with one click." },
];

const FOOTER_LINKS: Record<string, string[]> = {
  Product:   ["Features","Pricing","Roadmap","Changelog"],
  Resources: ["Help centre","Bill templates","Landlord guide","Contact"],
  Company:   ["About","Blog","Privacy","Terms"],
};

/* ─── Icons ─────────────────────────────────────────────────────────────── */

function Svg({ size = 22, sw = 1.8, children }: { size?: number; sw?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const IcHome      = (p: {size?:number}) => <Svg {...p}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M10 20v-5h4v5"/></Svg>;
const IcUsers     = (p: {size?:number}) => <Svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="6.5" r="2.5"/><path d="M16 13.5c2.8.4 5 2.5 5 5.5"/></Svg>;
const IcShare     = (p: {size?:number}) => <Svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5 15.4 6.5"/><path d="M8.6 13.5 15.4 17.5"/></Svg>;
const IcBolt      = (p: {size?:number}) => <Svg {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></Svg>;
const IcHistory   = (p: {size?:number}) => <Svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/></Svg>;
const IcBuildings = (p: {size?:number}) => <Svg {...p}><path d="M4 21V8l6-4 6 4v13"/><path d="M14 21V12h6v9"/><path d="M7 11h2"/><path d="M7 15h2"/><path d="M17 15h1"/><path d="M17 18h1"/></Svg>;
const IcPhone     = (p: {size?:number}) => <Svg {...p}><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></Svg>;
const IcClock     = (p: {size?:number}) => <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Svg>;
const IcAlert     = (p: {size?:number}) => <Svg {...p}><path d="M12 3 2 21h20Z"/><path d="M12 10v5"/><circle cx="12" cy="18" r="0.7" fill="currentColor" stroke="none"/></Svg>;
const IcBook      = (p: {size?:number}) => <Svg {...p}><path d="M4 4h13a3 3 0 0 1 3 3v14H7a3 3 0 0 1-3-3z"/><path d="M4 18a3 3 0 0 1 3-3h13"/></Svg>;
const IcCheck     = (p: {size?:number; sw?:number}) => <Svg size={p.size} sw={p.sw ?? 1.8}><path d="M5 12l5 5L20 7"/></Svg>;
const IcChevron   = (p: {size?:number}) => <Svg {...p}><path d="M6 9l6 6 6-6"/></Svg>;
const IcArrow     = (p: {size?:number; sw?:number}) => <Svg size={p.size} sw={p.sw ?? 1.8}><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></Svg>;
const IcPlay      = (p: {size?:number}) => <Svg {...p}><path d="M6 4v16l14-8z"/></Svg>;
const IcStar      = ({ size = 16 }: {size?:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 3 14.8 9l6.2.9-4.5 4.4 1.1 6.2L12 17.6 6.4 20.5l1.1-6.2L3 9.9 9.2 9z"/></svg>;
const IcSparkle   = (p: {size?:number}) => <Svg {...p}><path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/><path d="M19 3v3"/><path d="M5 18v3"/><path d="M3.5 19.5h3"/><path d="M17.5 4.5h3"/></Svg>;
const IcPdf       = (p: {size?:number}) => <Svg {...p}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M9 14h6"/><path d="M9 17h4"/></Svg>;

function IcWhatsApp({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6 0-.3-.1-1.2-.4-2.4-1.4-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2 3.1 5 4.4.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.5-.3z"/>
      <path d="M20.5 3.5C18.3 1.3 15.3 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.4zM12 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-3.7 1 1-3.6-.2-.4C2.4 15.5 1.8 13.8 1.8 12 1.8 6.4 6.4 1.8 12 1.8c2.7 0 5.3 1.1 7.2 3 1.9 1.9 3 4.5 3 7.2 0 5.6-4.6 10.2-10.2 10.2z"/>
    </svg>
  );
}

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(109,40,217,0.35)", flexShrink: 0 }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>
      </svg>
    </div>
  );
}

function iconFor(name: string, size = 22) {
  switch (name) {
    case "bolt":      return <IcBolt size={size} />;
    case "pdf":       return <IcPdf size={size} />;
    case "whatsapp":  return <IcWhatsApp size={size} />;
    case "history":   return <IcHistory size={size} />;
    case "buildings": return <IcBuildings size={size} />;
    case "phone":     return <IcPhone size={size} />;
    case "book":      return <IcBook size={size} />;
    case "clock":     return <IcClock size={size} />;
    case "alert":     return <IcAlert size={size} />;
    case "home":      return <IcHome size={size} />;
    case "users":     return <IcUsers size={size} />;
    case "share":     return <IcShare size={size} />;
    case "sparkle":   return <IcSparkle size={size} />;
    case "pdf":       return <IcPdf size={size} />;
    default:          return null;
  }
}

/* ─── Hooks ─────────────────────────────────────────────────────────────── */

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

/* ─── Counter ────────────────────────────────────────────────────────────── */

function Counter({ to, suffix = "", duration = 1800, key: _key }: { to: number; suffix?: string; duration?: number; key?: number | string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    let raf = 0;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            setVal(Math.round(to * ease(t)));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{val.toLocaleString("en-US")}{suffix}</span>;
}

/* ─── NavBar ─────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "How it works", href: "#how",      icon: "share"   },
  { label: "Features",     href: "#features", icon: "sparkle" },
  { label: "Pricing",      href: "#pricing",  icon: "pdf"     },
  { label: "FAQ",          href: "#faq",      icon: "book"    },
];

function MobileMenu({ open, onClose, onCTA, isAuthed }: { open: boolean; onClose: () => void; onCTA: () => void; isAuthed: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleLink = (cb?: () => void) => { onClose(); cb?.(); };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 98,
          background: "rgba(15,10,40,0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />
      {/* Bottom sheet card */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 99,
        transform: open ? "translateY(0)" : "translateY(110%)",
        transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1)",
        padding: "0 12px 12px",
      }}>
        <div style={{
          background: "white",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 -4px 60px rgba(109,40,217,0.18), 0 0 0 1px rgba(124,58,237,0.08)",
        }}>
          {/* Drag handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 999, background: "#e2e8f0" }} />
          </div>

          {/* Nav links */}
          <div style={{ padding: "8px 12px" }}>
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => handleLink()}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 14, fontSize: 15, fontWeight: 600, color: "#1b1733", textDecoration: "none", transition: "background 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f5f3ff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#6d28d9", flexShrink: 0 }}>
                  {iconFor(l.icon, 17)}
                </span>
                {l.label}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(124,58,237,0.08)", margin: "0 16px" }} />

          {/* CTA buttons */}
          <div style={{ padding: "12px 12px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
            {isAuthed ? (
              <>
                <Link
                  href={routes.dashboard}
                  onClick={() => handleLink()}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 16, padding: "15px", borderRadius: 16, textDecoration: "none", background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)", color: "white", boxShadow: "0 8px 24px -6px rgba(109,40,217,0.45)" }}
                >
                  Go to Dashboard <IcArrow size={16} sw={2.5} />
                </Link>
                <form action={logoutAction} style={{ display: "contents" }}>
                  <button
                    type="submit"
                    onClick={() => onClose()}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 16, padding: "15px", borderRadius: 16, border: "1.5px solid #fecaca", cursor: "pointer", background: "#fef2f2", color: "#ef4444" }}
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href={routes.login}
                  onClick={() => handleLink()}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#1b1733", textDecoration: "none", padding: "15px", borderRadius: 16, border: "1.5px solid rgba(124,58,237,0.2)", background: "#faf9ff" }}
                >
                  Sign in
                </Link>
                <button
                  onClick={() => handleLink(onCTA)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 16, padding: "15px", borderRadius: 16, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)", color: "white", boxShadow: "0 8px 24px -6px rgba(109,40,217,0.45)" }}
                >
                  Get started — it&apos;s free <IcArrow size={16} sw={2.5} />
                </button>
              </>
            )}
          </div>

          {/* Safe area spacer */}
          <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
        </div>
      </div>
    </>,
    document.body
  );
}

function NavBar({ onCTA, isAuthed }: { onCTA: () => void; isAuthed: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", background: "rgba(255,255,255,0.88)", borderBottom: "1px solid rgba(124,58,237,0.08)", boxShadow: scrolled ? "0 1px 0 rgba(15,23,42,0.04)" : "none" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#top" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <LogoMark size={36} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em", lineHeight: 1, color: "#1b1733" }}>RentalApp</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6d28d9", marginTop: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>Landlord Dashboard</div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="landing-nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} style={{ padding: "10px 14px", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#334155", textDecoration: "none", transition: "color 0.15s, background 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#6d28d9"; (e.currentTarget as HTMLElement).style.background = "#ede9fe"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#334155"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>{l.label}</a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="landing-nav-cta" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isAuthed ? (
              <Link href={routes.dashboard} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 13, padding: "10px 16px", borderRadius: 12, textDecoration: "none", background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)", color: "white", boxShadow: "0 14px 32px -8px rgba(109,40,217,0.45)" }}>
                Go to Dashboard <IcArrow size={14} sw={2.5} />
              </Link>
            ) : (
              <>
                <Link href={routes.login} className="landing-signin" style={{ fontSize: 14, fontWeight: 700, color: "#0a1628", textDecoration: "none", padding: "10px 6px" }}>Sign in</Link>
                <button onClick={onCTA} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 13, padding: "10px 16px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)", color: "white", boxShadow: "0 14px 32px -8px rgba(109,40,217,0.45)" }}>
                  Get started <IcArrow size={14} sw={2.5} />
                </button>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="landing-burger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ display: "none", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5, width: 40, height: 40, borderRadius: 10, border: "1px solid rgba(124,58,237,0.15)", background: menuOpen ? "#ede9fe" : "transparent", cursor: "pointer", padding: 0, transition: "background 0.15s" }}
          >
            <span style={{ display: "block", width: 18, height: 2, borderRadius: 2, background: "#1b1733", transition: "transform 0.25s, opacity 0.25s", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: 18, height: 2, borderRadius: 2, background: "#1b1733", transition: "opacity 0.2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 18, height: 2, borderRadius: 2, background: "#1b1733", transition: "transform 0.25s, opacity 0.25s", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onCTA={onCTA} isAuthed={isAuthed} />
    </>
  );
}

/* ─── Section header ─────────────────────────────────────────────────────── */

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle: string }) {
  return (
    <div className="reveal" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 8px", borderRadius: 999, background: "#ede9fe", color: "#6d28d9", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", border: "1px solid #ddd6fe" }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor", boxShadow: "0 0 0 3px rgba(124,58,237,0.15)" }} /> {eyebrow}
      </span>
      <h2 style={{ margin: 0, letterSpacing: "-0.025em", fontWeight: 800, lineHeight: 1.1, fontSize: "clamp(32px,3.8vw,48px)" }}>{title}</h2>
      <p style={{ margin: 0, color: "#5b5470", fontSize: "clamp(17px,1.4vw,19px)", lineHeight: 1.55, maxWidth: 620 }}>{subtitle}</p>
    </div>
  );
}

/* ─── Floating bill ──────────────────────────────────────────────────────── */

function FloatingBill({ style, accent = "#6d28d9", scale = 1, className = "" }: { style?: React.CSSProperties; accent?: string; scale?: number; className?: string }) {
  return (
    <div className={className} style={{ position: "absolute", width: 220 * scale, height: 280 * scale, background: "white", borderRadius: 18, boxShadow: "0 24px 60px -12px rgba(15,23,42,0.28),0 6px 16px rgba(15,23,42,0.12)", padding: 18 * scale, fontFamily: "inherit", ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 * scale }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 * scale }}>
          <div style={{ width: 22 * scale, height: 22 * scale, borderRadius: 6 * scale, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={12 * scale} height={12 * scale} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>
          </div>
          <div style={{ fontSize: 10 * scale, fontWeight: 800, color: "#0a1628" }}>RentalApp</div>
        </div>
        <div style={{ fontSize: 8 * scale, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>JUN &apos;26</div>
      </div>
      <div style={{ fontSize: 13 * scale, fontWeight: 800, color: "#0a1628", letterSpacing: "-0.02em" }}>Mike</div>
      <div style={{ fontSize: 9 * scale, color: "#64748b", marginTop: 2 }}>A-38 · First Floor</div>
      <div style={{ marginTop: 14 * scale, paddingTop: 10 * scale, borderTop: "1px dashed #e2e8f0" }}>
        {[{ label: "Rent", val: "18,000" }, { label: "Electricity", val: "1,240" }, { label: "Water", val: "200" }, { label: "Maintenance", val: "500" }].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: `${5 * scale}px 0`, fontSize: 10 * scale, color: "#475569", borderTop: i > 0 ? "1px dashed #f1f5f9" : "none" }}>
            <span>{r.label}</span><span style={{ fontWeight: 700, color: "#0a1628" }}>{r.val}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 * scale, padding: `${8 * scale}px ${10 * scale}px`, borderRadius: 10, background: `linear-gradient(135deg,${accent} 0%,${accent}CC 100%)`, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9 * scale, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.85 }}>Total</span>
        <span style={{ fontSize: 14 * scale, fontWeight: 800, letterSpacing: "-0.02em" }}>19,940</span>
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */

function Hero({ onCTA }: { onCTA: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div ref={ref} id="top" style={{ background: "linear-gradient(180deg,#efeaff 0%,#f6f3ff 60%,#ffffff 100%)", paddingTop: 56, paddingBottom: 96, minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 80%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -160, right: -120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.20) 0%,transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -200, left: -120, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 1320, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div className="reveal">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 8px", borderRadius: 999, background: "#ede9fe", color: "#6d28d9", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", border: "1px solid #ddd6fe" }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor", boxShadow: "0 0 0 3px rgba(124,58,237,0.15)" }} /> Free for landlords · No card required
              </span>
            </div>
            <h1 className="reveal reveal-delay-1" style={{ margin: "22px 0 0", color: "#1b1733", fontWeight: 800, fontSize: "clamp(40px,5vw,64px)", letterSpacing: "-0.025em", lineHeight: 1.05 }}>
              Stop writing bills by hand.{" "}
              <span style={{ position: "relative", whiteSpace: "nowrap", display: "inline-block" }}>
                Go digital today
                <svg viewBox="0 0 220 14" preserveAspectRatio="none" style={{ position: "absolute", left: "-4%", bottom: -8, width: "108%", height: 14, pointerEvents: "none" }}>
                  <path d="M4 10 C 40 2, 80 12, 120 7 S 200 4, 216 9" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" fill="none" className="scribble-path" />
                </svg>
              </span>
              .
            </h1>
            <p className="reveal reveal-delay-2" style={{ marginTop: 24, maxWidth: 520, color: "#5b5470", fontSize: "clamp(17px,1.4vw,19px)", lineHeight: 1.55 }}>
              No more billing books. No more manual math. Generate every tenant's bill in one click and share it on WhatsApp — in the time it took you to find the pen.
            </p>
            <div className="reveal reveal-delay-3" style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={onCTA} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 16, padding: "18px 28px", borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)", color: "white", boxShadow: "0 14px 32px -8px rgba(109,40,217,0.45)", animation: "pulse-violet 2.4s ease-out infinite" }}>
                Get started — it&apos;s free <IcArrow size={18} sw={2.5} />
              </button>
              <a href="#how" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 16, padding: "18px 28px", borderRadius: 14, textDecoration: "none", background: "#ede9fe", color: "#6d28d9", border: "1px solid #ddd6fe" }}>
                <IcPlay size={14} /> See how it works
              </a>
            </div>
            <div className="reveal reveal-delay-4" style={{ marginTop: 44, padding: "18px 22px", borderRadius: 16, background: "white", border: "1px solid rgba(124,58,237,0.10)", boxShadow: "0 6px 22px -8px rgba(76,29,149,0.16),0 1px 2px rgba(76,29,149,0.05)", display: "inline-flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ede9fe", border: "1px solid #ddd6fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#6d28d9" }}>
                <IcBolt size={20} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "#1b1733" }}><Counter to={347} duration={2200} /> bills</div>
                <div style={{ fontSize: 13, color: "#5b5470", marginTop: 2 }}>generated by landlords today — and counting</div>
              </div>
            </div>
          </div>
          <div className="reveal reveal-delay-2 hero-illustration" style={{ position: "relative", height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)", filter: "blur(20px)" }} />
            <FloatingBill accent="#14b8a6" scale={0.9} className="float-slow" style={{ top: 40, left: 0, opacity: 0.55, filter: "blur(0.5px)" }} />
            <FloatingBill accent="#0ea5e9" scale={1.0} className="float-med" style={{ top: 90, right: 0, opacity: 0.8 }} />
            <FloatingBill accent="#6d28d9" scale={1.15} className="float-fast" style={{ top: 80, left: "26%", zIndex: 3 }} />
            <div className="float-med" style={{ position: "absolute", bottom: 80, right: -10, background: "white", borderRadius: 14, padding: "12px 16px", boxShadow: "0 24px 60px -12px rgba(15,23,42,0.35)", display: "flex", alignItems: "center", gap: 12, zIndex: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "#25D366", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><IcWhatsApp size={18} /></div>
              <div><div style={{ fontSize: 12, fontWeight: 800, color: "#0a1628", lineHeight: 1 }}>Sent on WhatsApp</div><div style={{ fontSize: 11, color: "#64748b", marginTop: 3, lineHeight: 1 }}>2 seconds ago</div></div>
            </div>
            <div className="float-slow" style={{ position: "absolute", top: 24, right: 60, background: "white", borderRadius: 999, padding: "8px 14px 8px 8px", boxShadow: "0 16px 40px -8px rgba(15,23,42,0.32)", display: "flex", alignItems: "center", gap: 8, zIndex: 4 }}>
              <div style={{ width: 22, height: 22, borderRadius: 999, background: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><IcCheck size={13} sw={3.5} /></div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0a1628" }}>PDF saved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Trust bar ──────────────────────────────────────────────────────────── */

function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div ref={ref} style={{ padding: "32px 0 16px", borderTop: "1px solid rgba(124,58,237,0.08)" }}>
      <div className="reveal" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", marginBottom: 24 }}>Used by 500+ landlords across 14 cities</div>
        <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)" }}>
          <div style={{ display: "flex", gap: 56, width: "max-content", animation: "marquee 32s linear infinite" }}>
            {[...TRUST_LOGOS, ...TRUST_LOGOS].map((name, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: "#94a3b8", whiteSpace: "nowrap" }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: "#ede9fe", border: "1px solid #ddd6fe", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#6d28d9" }}>{name[0]}</span>
                </span>
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Problem section ────────────────────────────────────────────────────── */

function Problem() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} style={{ padding: "96px 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div className="problem-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div className="reveal">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 8px", borderRadius: 999, background: "#ede9fe", color: "#6d28d9", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", border: "1px solid #ddd6fe" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor" }} /> The way you do it now
            </span>
            <h2 style={{ marginTop: 18, fontWeight: 800, fontSize: "clamp(32px,3.8vw,48px)", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              Paper billing books were invented in the 1800s.{" "}
              <span style={{ color: "#6d28d9" }}>You don&apos;t have to live there.</span>
            </h2>
            <p style={{ marginTop: 18, maxWidth: 480, color: "#5b5470", fontSize: "clamp(17px,1.4vw,19px)", lineHeight: 1.55 }}>
              If any of this sounds painfully familiar, you&apos;re not alone — every landlord on RentalApp started exactly where you are.
            </p>
          </div>
          <div className="reveal reveal-delay-1" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280 }}>
            <PaperToDigital />
          </div>
        </div>
        <div className="problem-cards" style={{ marginTop: 72, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {PROBLEMS.map((p, i) => (
            <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ background: "white", border: "1px solid rgba(124,58,237,0.08)", borderRadius: 20, boxShadow: "0 6px 22px -8px rgba(76,29,149,0.16),0 1px 2px rgba(76,29,149,0.05)", padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${p.accent}1A`, color: p.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {iconFor(p.icon, 22)}
              </div>
              <h3 style={{ margin: 0, color: "#1b1733", fontSize: 18, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.025em" }}>{p.title}</h3>
              <p style={{ margin: 0, color: "#5b5470", fontSize: 14.5, lineHeight: 1.6 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PaperToDigital() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let interval = 0;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) interval = window.setInterval(() => setStage(s => 1 - s), 3200);
        else clearInterval(interval);
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => { obs.disconnect(); clearInterval(interval); };
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", width: 340, height: 220, perspective: 1200 }}>
      <div style={{ position: "absolute", inset: 0, transition: "opacity 0.6s ease,transform 0.8s cubic-bezier(0.7,-0.4,0.4,1.4)", opacity: stage === 0 ? 1 : 0, transform: stage === 0 ? "rotate(-4deg) scale(1)" : "rotate(-14deg) scale(0.8) translateY(40px)", transformOrigin: "center" }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)", borderRadius: 6, boxShadow: "0 12px 24px -6px rgba(0,0,0,0.15),inset 0 0 0 1px rgba(0,0,0,0.05)", padding: 18, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: "linear-gradient(90deg,rgba(0,0,0,0.12) 0%,transparent 100%)", borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }} />
          <div style={{ marginLeft: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Rent Receipt · 2026</div>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 1, background: "rgba(146,64,14,0.25)", marginBottom: 16, position: "relative" }}>
                {i === 1 && <div style={{ position: "absolute", left: 0, top: -10, fontFamily: "'Instrument Serif',serif", fontSize: 14, color: "#78350f", fontStyle: "italic" }}>Mr. Mike — 19,940</div>}
                {i === 3 && <div style={{ position: "absolute", left: 0, top: -10, fontFamily: "'Instrument Serif',serif", fontSize: 12, color: "#78350f", fontStyle: "italic" }}>(scribbled out twice...)</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, transition: "opacity 0.6s ease,transform 0.8s cubic-bezier(0.16,1,0.3,1)", opacity: stage === 1 ? 1 : 0, transform: stage === 1 ? "rotate(2deg) scale(1)" : "rotate(8deg) scale(0.85) translateY(-30px)" }}>
        <div style={{ width: "100%", height: "100%", background: "white", borderRadius: 14, boxShadow: "0 24px 50px -10px rgba(15,23,42,0.25)", padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <LogoMark size={26} />
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1b1733" }}>RentalApp</div>
            <div style={{ marginLeft: "auto", padding: "3px 9px", borderRadius: 999, background: "#ecfdf5", color: "#047857", fontSize: 10, fontWeight: 800 }}>PAID</div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1b1733", letterSpacing: "-0.02em" }}>Bobzy</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>A-38 · First Floor · June 2026</div>
          <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed #e2e8f0" }}>
            {[{ l: "Rent", v: "18,000" }, { l: "Electricity", v: "1,240" }, { l: "Water", v: "200" }, { l: "Maintenance", v: "500" }].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "4px 0", color: "#475569" }}><span>{r.l}</span><span style={{ fontWeight: 700, color: "#1b1733" }}>{r.v}</span></div>
            ))}
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: "linear-gradient(135deg,#6d28d9,#7c3aed)", color: "white", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total</span>
              <span style={{ fontSize: 14, fontWeight: 800 }}>19,940</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── How It Works ───────────────────────────────────────────────────────── */

function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const icons = ["home", "users", "share"];
  return (
    <section ref={ref} id="how" style={{ padding: "96px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeader eyebrow="How it works" title="From property to paid in three steps" subtitle="Most landlords are sending their first bill within 10 minutes of signing up. Here's the entire flow." />
        <div style={{ position: "relative" }}>
          <svg viewBox="0 0 1200 240" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, top: 64, width: "100%", height: 240, pointerEvents: "none", zIndex: 0 }} className="connector-svg">
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" /><stop offset="50%" stopColor="#14b8a6" stopOpacity="0.9" /><stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path d="M 200 100 C 350 30, 450 30, 600 100 S 850 170, 1000 100" stroke="url(#cg)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="6 8" />
          </svg>
          <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, position: "relative", zIndex: 1 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className={`reveal reveal-delay-${i + 1}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ position: "relative", marginBottom: 24 }}>
                  <div style={{ width: 88, height: 88, borderRadius: 26, background: s.grad, display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: s.shadow }}>
                    {iconFor(icons[i], 36)}
                  </div>
                  <div style={{ position: "absolute", top: -8, right: -8, width: 32, height: 32, borderRadius: 999, background: "white", color: "#1b1733", border: "2px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, letterSpacing: "0.02em", boxShadow: "0 4px 8px rgba(15,23,42,0.08)" }}>{s.n}</div>
                </div>
                <h3 style={{ margin: "0 0 10px", color: "#1b1733", fontSize: 22, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.025em" }}>{s.title}</h3>
                <p style={{ margin: 0, maxWidth: 280, fontSize: 15, color: "#5b5470", lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ───────────────────────────────────────────────────────────── */

function Features() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} id="features" style={{ padding: "96px 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeader eyebrow="What's inside" title="Everything you need, nothing you don't" subtitle="We deliberately kept it simple. RentalApp does the few things landlords actually use — really well." />
        <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`reveal reveal-delay-${(i % 3) + 1}`}
              style={{ background: "white", border: "1px solid rgba(124,58,237,0.08)", borderRadius: 20, boxShadow: "0 6px 22px -8px rgba(76,29,149,0.16),0 1px 2px rgba(76,29,149,0.05)", padding: 28, display: "flex", flexDirection: "column", gap: 16, transition: "transform 0.2s,box-shadow 0.2s", cursor: "default" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 28px 64px -16px rgba(76,29,149,0.26),0 4px 12px rgba(76,29,149,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 22px -8px rgba(76,29,149,0.16),0 1px 2px rgba(76,29,149,0.05)"; }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}18`, color: f.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {iconFor(f.icon, 22)}
              </div>
              <h3 style={{ margin: 0, color: "#1b1733", fontSize: 19, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.025em" }}>{f.title}</h3>
              <p style={{ margin: 0, color: "#5b5470", fontSize: 14.5, lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Sample Bill Demo ───────────────────────────────────────────────────── */

const DEMO_TENANTS = [
  { id: "t1", name: "Mike Johnson",  unit: "First Floor",  rent: 18000, rate: 8.5, gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
  { id: "t2", name: "Sarah Williams",   unit: "Ground Floor", rent: 18500, rate: 8.5, gradient: "linear-gradient(135deg,#14b8a6,#5eead4)" },
  { id: "t3", name: "Ahmed Khan", unit: "Shop Mid",     rent: 22000, rate: 8.5, gradient: "linear-gradient(135deg,#10b981,#6ee7b7)" },
];

function SampleBillDemo() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [tenant, setTenant] = useState(DEMO_TENANTS[0]);
  const [meter, setMeter] = useState(146);
  const [sent, setSent] = useState(false);
  const electricity = Math.round(meter * tenant.rate);
  const total = tenant.rent + electricity + 200 + 500;
  useEffect(() => {
    if (sent) { const t = setTimeout(() => setSent(false), 2400); return () => clearTimeout(t); }
  }, [sent]);
  return (
    <section ref={ref} id="demo" style={{ padding: "96px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeader eyebrow="Try it" title="See a bill come together" subtitle="No signup, no install — just pick a tenant, enter the meter reading, and watch the bill assemble itself." />
        <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>
          <div style={{ padding: 32, borderRadius: 20, background: "linear-gradient(160deg,#7c3aed 0%,#6d28d9 100%)", color: "white", boxShadow: "0 24px 60px -16px rgba(109,40,217,0.5)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>Step 1 — pick a tenant</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {DEMO_TENANTS.map(t => {
                const active = tenant.id === t.id;
                return (
                  <button key={t.id} onClick={() => setTenant(t)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 14, background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)", border: active ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(255,255,255,0.12)", color: "white", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: t.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white", flexShrink: 0 }}>{t.name.split(" ").map(p => p[0]).join("")}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{t.unit} · Rent {t.rent.toLocaleString()}</div>
                    </div>
                    {active && <div style={{ width: 22, height: 22, borderRadius: 999, background: "white", color: "#6d28d9", display: "flex", alignItems: "center", justifyContent: "center" }}><IcCheck size={13} sw={3.5} /></div>}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Step 2 — meter reading</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="range" min="40" max="320" step="1" value={meter} onChange={e => setMeter(parseInt(e.target.value))} style={{ flex: 1, accentColor: "#ffffff", height: 4 }} />
              <div style={{ minWidth: 110, padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "monospace", fontWeight: 600, fontSize: 14, textAlign: "center" }}>{meter} units</div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 10 }}>At {tenant.rate}/unit · this is the only thing that changes month to month.</div>
            <div style={{ marginTop: 28 }}>
              <button onClick={() => setSent(true)} disabled={sent} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", fontWeight: 800, fontSize: 15, padding: "14px 22px", borderRadius: 12, border: "none", cursor: sent ? "default" : "pointer", background: "white", color: "#6d28d9" }}>
                {sent ? <><IcCheck size={16} sw={3} /> Sent on WhatsApp</> : <><IcWhatsApp size={16} /> Send on WhatsApp</>}
              </button>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 28, boxShadow: "0 6px 22px -8px rgba(76,29,149,0.16)", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <LogoMark size={32} />
                  <div><div style={{ fontWeight: 800, fontSize: 15, color: "#1b1733" }}>RentalApp</div><div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase" }}>Monthly bill</div></div>
                </div>
                <div style={{ padding: "5px 11px", borderRadius: 999, background: "#ede9fe", color: "#6d28d9", fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }}>June 2026</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 18, marginBottom: 18, borderBottom: "1px dashed #e2e8f0" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: tenant.gradient, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, transition: "background 0.3s" }}>{tenant.name.split(" ").map(p => p[0]).join("")}</div>
                <div><div style={{ fontWeight: 800, fontSize: 18, color: "#1b1733", letterSpacing: "-0.01em" }}>{tenant.name}</div><div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>A-38 · {tenant.unit}</div></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { l: "Rent", v: tenant.rent, sub: null, highlight: false },
                  { l: "Electricity", v: electricity, sub: `${meter} units × ${tenant.rate}`, highlight: true },
                  { l: "Water", v: 200, sub: null, highlight: false },
                  { l: "Maintenance", v: 500, sub: null, highlight: false },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: row.highlight ? "#ede9fe" : "transparent", border: row.highlight ? "1px dashed #c4b5fd" : "1px dashed transparent" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1b1733" }}>{row.l}</div>
                      {row.sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, fontFamily: "monospace" }}>{row.sub}</div>}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1b1733", fontVariantNumeric: "tabular-nums" }}>{row.v.toLocaleString("en-US")}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "16px 18px", borderRadius: 14, background: "linear-gradient(135deg,#6d28d9,#7c3aed)", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Total due</span>
                <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
                  <Counter to={total} duration={400} key={total} />
                </span>
              </div>
            </div>
            {sent && (
              <div style={{ position: "absolute", top: -16, right: -16, background: "white", borderRadius: 14, padding: "12px 16px", boxShadow: "0 24px 60px -8px rgba(16,185,129,0.45)", display: "flex", alignItems: "center", gap: 10, zIndex: 5, animation: "slideIn 0.3s ease-out" }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, background: "#25D366", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><IcWhatsApp size={18} /></div>
                <div><div style={{ fontSize: 13, fontWeight: 800, color: "#1b1733", lineHeight: 1 }}>Bill sent to {tenant.name}</div><div style={{ fontSize: 11, color: "#64748b", marginTop: 3, lineHeight: 1 }}>Just now</div></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} style={{ padding: "96px 0", background: "linear-gradient(180deg,#efeaff 0%,#f6f3ff 60%,#ffffff 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 80%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.14) 0%,transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        <SectionHeader eyebrow="The numbers so far" title={<>Small but <span style={{ color: "#6d28d9" }}>growing fast</span></>} subtitle="We launched quietly with a handful of landlords. They told other landlords. Here's where we are today." />
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {STATS.map((s, i) => (
            <div key={s.label} className={`reveal reveal-delay-${i + 1}`} style={{ padding: "36px 28px", borderRadius: 24, background: "white", border: "1px solid rgba(124,58,237,0.10)", boxShadow: "0 6px 22px -8px rgba(76,29,149,0.16)", textAlign: "center" }}>
              <div style={{ fontSize: "clamp(48px,6vw,72px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, background: "linear-gradient(180deg,#7c3aed 0%,#4c1d95 130%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                <Counter to={s.value} suffix={s.suffix} duration={2200} />
              </div>
              <div style={{ marginTop: 14, fontSize: 17, fontWeight: 700, color: "#1b1733" }}>{s.label}</div>
              <div style={{ marginTop: 4, fontSize: 14, color: "#5b5470" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────────────────── */

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} style={{ padding: "96px 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeader eyebrow="From landlords like you" title="What people are actually saying" subtitle="We don't pay for reviews. These are real landlords who emailed us with feedback — we just asked if we could quote them." />
        <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`reveal reveal-delay-${i + 1}`} style={{ background: "white", border: "1px solid rgba(124,58,237,0.08)", borderRadius: 20, boxShadow: "0 6px 22px -8px rgba(76,29,149,0.16)", padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", gap: 4 }}>{[...Array(5)].map((_, j) => <IcStar key={j} size={16} />)}</div>
              <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "#1b1733", fontWeight: 500 }}>&quot;{t.quote}&quot;</blockquote>
              <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: t.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 13 }}>{t.initials}</div>
                <div><div style={{ fontWeight: 800, fontSize: 14, color: "#1b1733" }}>{t.name}</div><div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────────────────────────── */

function Pricing() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const included = ["Unlimited properties","Unlimited tenants","Unlimited bills, every month","PDF download + WhatsApp share","Full bill history & search","Mobile-optimised dashboard","Email support within 24 hours"];
  return (
    <section ref={ref} id="pricing" style={{ padding: "96px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeader eyebrow="Pricing" title={<>Right now, it&apos;s all free —{" "}<span style={{ color: "#6d28d9" }}>and we mean it</span></>} subtitle="No card. No trial countdown. No 'free up to 3 bills then 999/mo'. Just the whole product, on us, while we're building it out." />
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 24, maxWidth: 980, margin: "0 auto" }}>
          <div className="reveal" style={{ padding: 36, borderRadius: 20, position: "relative", border: "2px solid #7c3aed", background: "linear-gradient(180deg,white 0%,#f5f3ff 100%)", boxShadow: "0 24px 60px -12px rgba(109,40,217,0.25)" }}>
            <div style={{ position: "absolute", top: -14, left: 36, padding: "5px 14px", borderRadius: 999, background: "#6d28d9", color: "white", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>The only plan you need today</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px -4px rgba(109,40,217,0.4)" }}><IcSparkle size={22} /></div>
              <div><div style={{ fontSize: 13, fontWeight: 800, color: "#6d28d9", letterSpacing: "0.06em", textTransform: "uppercase" }}>Free</div><h3 style={{ margin: 0, fontSize: 24, color: "#1b1733", fontWeight: 700, letterSpacing: "-0.025em" }}>For every landlord, everywhere</h3></div>
            </div>
            <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 60, fontWeight: 800, color: "#1b1733", letterSpacing: "-0.04em", lineHeight: 1 }}>0</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>/ month, forever (for now)</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
              {included.map(item => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "#1b1733", fontWeight: 500 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, background: "#10b981", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IcCheck size={13} sw={3.5} /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href={routes.register} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 16, padding: "18px 28px", borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)", color: "white", boxShadow: "0 14px 32px -8px rgba(109,40,217,0.45)", marginTop: 32, width: "100%", textDecoration: "none", boxSizing: "border-box" }}>
              Get started — it&apos;s free <IcArrow size={18} sw={2.5} />
            </Link>
            <div style={{ marginTop: 14, textAlign: "center", fontSize: 12.5, color: "#64748b" }}>No credit card · Cancel any time (there&apos;s nothing to cancel)</div>
          </div>
          <div className="reveal reveal-delay-1" style={{ padding: 32, borderRadius: 20, background: "#f8fafc", border: "1px dashed #cbd5e1", display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, padding: "6px 12px 6px 8px", borderRadius: 999, background: "#ede9fe", color: "#6d28d9", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", border: "1px solid #ddd6fe" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor" }} /> Pro · coming later
            </span>
            <h3 style={{ margin: 0, color: "#1b1733", fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em" }}>When we add Pro, it&apos;ll be for landlords who want more.</h3>
            <p style={{ margin: 0, fontSize: 14.5, color: "#5b5470", lineHeight: 1.6 }}>Things like custom branding on bills, accountant exports, automated reminders, and team members. <strong style={{ color: "#1b1733" }}>Existing users get a heads-up first</strong> — and the free plan isn&apos;t going anywhere.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              {["Custom branding (your logo on every bill)","Accountant-friendly CSV exports","Automated overdue reminders","Team members & multi-owner access"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "#334155" }}>
                  <span style={{ width: 18, height: 18, borderRadius: 999, border: "1.5px dashed #94a3b8", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
            <a href="#cta" style={{ marginTop: "auto", fontSize: 14, fontWeight: 700, color: "#6d28d9", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Get the email when Pro launches <IcArrow size={14} sw={2.5} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────────────── */

function Faq() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section ref={ref} id="faq" style={{ padding: "96px 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>
        <SectionHeader eyebrow="Questions you might have" title="The short answers" subtitle="Couldn't find what you're looking for? Email us at hello@rentalapp.co — we reply within a day." />
        <div className="reveal" style={{ background: "white", border: "1px solid rgba(124,58,237,0.08)", borderRadius: 20, boxShadow: "0 6px 22px -8px rgba(76,29,149,0.16)", padding: 8 }}>
          {FAQS.map((f, i) => (
            <div key={f.q} style={{ borderBottom: i < FAQS.length - 1 ? "1px solid #e2e8f0" : "none", background: openIdx === i ? "#f8fafc" : "transparent", borderRadius: openIdx === i ? 14 : 0, transition: "background 0.2s,border-radius 0.2s" }}>
              <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "22px 20px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#1b1733", letterSpacing: "-0.01em" }}>{f.q}</span>
                <span style={{ width: 32, height: 32, borderRadius: 999, background: openIdx === i ? "#6d28d9" : "#f1f5f9", color: openIdx === i ? "white" : "#334155", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 0.2s,background 0.2s,color 0.2s", transform: openIdx === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <IcChevron size={16} />
                </span>
              </button>
              <div style={{ maxHeight: openIdx === i ? 200 : 0, overflow: "hidden", transition: "max-height 0.3s ease,padding 0.3s", padding: openIdx === i ? "0 20px 22px" : "0 20px" }}>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#475569", maxWidth: 720 }}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ──────────────────────────────────────────────────────────── */

function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} id="cta" style={{ padding: "96px 0", background: "linear-gradient(180deg,#efeaff 0%,#f6f3ff 60%,#ffffff 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 80%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2, textAlign: "center" }}>
        <div className="reveal" style={{ marginBottom: 18, display: "flex", justifyContent: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 8px", borderRadius: 999, background: "#ede9fe", color: "#6d28d9", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", border: "1px solid #ddd6fe" }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor" }} /> Join 500+ landlords
          </span>
        </div>
        <h2 className="reveal reveal-delay-1" style={{ color: "#1b1733", maxWidth: 800, margin: "0 auto", fontWeight: 800, fontSize: "clamp(32px,3.8vw,48px)", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
          Stop writing bills by hand.{" "}<span style={{ color: "#6d28d9" }}>Start today — it&apos;s free.</span>
        </h2>
        <p className="reveal reveal-delay-2" style={{ marginTop: 22, maxWidth: 580, marginLeft: "auto", marginRight: "auto", color: "#5b5470", fontSize: "clamp(17px,1.4vw,19px)", lineHeight: 1.55 }}>
          Five minutes from now you could be sending your next month&apos;s bills on WhatsApp instead of digging out the pen.
        </p>
        <div className="reveal reveal-delay-3" style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link href={routes.register} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 16, padding: "18px 28px", borderRadius: 14, textDecoration: "none", background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)", color: "white", boxShadow: "0 14px 32px -8px rgba(109,40,217,0.45)", animation: "pulse-violet 2.4s ease-out infinite" }}>
            Create your free account <IcArrow size={18} sw={2.5} />
          </Link>
          <a href="#demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 16, padding: "18px 28px", borderRadius: 14, textDecoration: "none", background: "white", color: "#0a1628", border: "1px solid #e2e8f0" }}>
            Try the demo first
          </a>
        </div>
        <div className="reveal reveal-delay-4" style={{ marginTop: 28, fontSize: 13, color: "#5b5470" }}>
          No card required · Setup takes under 10 minutes · Free forever for the first 100 bills/month
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer style={{ background: "#050b1a", color: "white", padding: "72px 0 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <LogoMark size={40} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>RentalApp</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginTop: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>Landlord Dashboard</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", maxWidth: 340, lineHeight: 1.6, margin: 0 }}>The bill-writing software for landlords who&apos;d rather not be writing bills. Built with care from Karachi.</p>
            <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
              {["𝕏","in","@"].map(g => (
                <a key={g} href="#" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 14, fontWeight: 700, transition: "background 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}>{g}</a>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([col, items]) => (
            <div key={col}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{col}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map(item => (
                  <li key={item}><a href="#" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}>{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>© 2026 RentalApp · Made for landlords, by landlords</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#10b981" }} /> All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Global styles ──────────────────────────────────────────────────────── */

const LANDING_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

  .landing-page { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }

  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
  .reveal.in { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.08s; }
  .reveal-delay-2 { transition-delay: 0.16s; }
  .reveal-delay-3 { transition-delay: 0.24s; }
  .reveal-delay-4 { transition-delay: 0.32s; }
  .reveal-delay-5 { transition-delay: 0.40s; }
  @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }

  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes float-slow { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-12px) rotate(-2deg); } }
  @keyframes float-med  { 0%,100% { transform: translateY(0) rotate(4deg);  } 50% { transform: translateY(-16px) rotate(6deg); } }
  @keyframes float-fast { 0%,100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(-20px) rotate(-6deg); } }
  .float-slow { animation: float-slow 6s ease-in-out infinite; }
  .float-med  { animation: float-med  5s ease-in-out infinite; }
  .float-fast { animation: float-fast 4.5s ease-in-out infinite; }

  @keyframes pulse-violet { 0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); } 50% { box-shadow: 0 0 0 14px rgba(124,58,237,0); } }
  @keyframes slideIn { from { opacity: 0; transform: translate(20px,-10px); } to { opacity: 1; transform: translate(0,0); } }

  .scribble-path { stroke-dasharray: 600; stroke-dashoffset: 600; transition: stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1) 0.4s; }
  .reveal.in .scribble-path { stroke-dashoffset: 0; }

  @media (max-width: 920px) { .hero-grid { grid-template-columns: 1fr !important; gap: 24px !important; } .hero-illustration { display: none !important; } }
  @media (max-width: 800px) {
    .landing-nav-links { display: none !important; }
    .landing-nav-cta  { display: none !important; }
    .landing-burger   { display: flex !important; }
  }
  @media (max-width: 880px) {
    .problem-grid, .how-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    .problem-cards, .feat-grid, .stats-grid, .testi-grid { grid-template-columns: 1fr !important; }
    .demo-grid, .pricing-grid { grid-template-columns: 1fr !important; }
    .connector-svg { display: none; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
    .footer-grid > div:first-child { grid-column: 1 / -1; }
  }
  @media (min-width: 881px) and (max-width: 1100px) { .feat-grid { grid-template-columns: repeat(2,1fr) !important; } .testi-grid { grid-template-columns: repeat(2,1fr) !important; } }
`;

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function LandingPage({ isAuthed }: { isAuthed: boolean }) {
  const onCTA = useCallback(() => {
    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="landing-page">
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />
      <NavBar onCTA={onCTA} isAuthed={isAuthed} />
      <Hero onCTA={onCTA} />
      <TrustBar />
      <Problem />
      <HowItWorks />
      <Features />
      <SampleBillDemo />
      <StatsSection />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}
