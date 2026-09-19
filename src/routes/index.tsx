import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Facebook, Instagram, MapPin } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/mvza-logo.png.asset.json";
import filmAsset from "@/assets/mvza-opening-film.mp4.asset.json";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "MVZA Jewels | Antique Gold Jewellery Ahmedabad" },
      { name: "description", content: "MVZA Jewels opens in Ahmedabad on 20 October 2026. Discover antique gold jewellery and request your special opening invitation." },
      { property: "og:title", content: "MVZA Jewels — The unveiling awaits" },
      { property: "og:description", content: "Antique gold jewellery arrives in Ahmedabad on 20 October 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const openingDate = new Date("2026-10-20T10:00:00+05:30");
const address = "9, Keshavbaug Capital, Near Shivranjani Cross Rd, next to ITC Narmada, I I M, Vastrapur, Ahmedabad, Gujarat 380015";

function getCountdown() {
  const distance = Math.max(0, openingDate.getTime() - Date.now());
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

function Index() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [venueOpen, setVenueOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function submitInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const { error } = await supabase.from("opening_invitations").insert({ name, phone });
    if (error) {
      setStatus("error");
      return;
    }
    formElement.reset();
    setStatus("success");
  }

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative flex min-h-[92svh] items-end justify-center overflow-hidden bg-ink px-5 pb-12 pt-8 text-ivory md:min-h-[94vh] md:pb-16">
        <video
          ref={(el) => {
            if (el) {
              el.defaultMuted = true;
              el.muted = true;
            }
          }}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Antique gold necklace under a warm gallery light"
        >
          <source src="/mvza-opening-film.mp4" type="video/mp4" />
          <source src={filmAsset.url} type="video/mp4" />
          <source src="https://eea26354-54ce-420d-b14d-4982bacbb73b.lovableproject.com/__l5e/assets-v1/e0af91d4-7c2d-4d45-a3e7-9b7ac38d1359/mvza-opening-film.mp4" type="video/mp4" />
        </video>
        <div className="film-shade absolute inset-0" />
        <img
          src={logoAsset.url || "/mvza-logo.png"}
          onError={(e) => {
            e.currentTarget.src = "/mvza-logo.png";
          }}
          alt="MVZA Jewels"
          className="absolute left-1/2 top-5 z-10 w-44 -translate-x-1/2 mix-blend-screen md:top-8 md:w-56"
        />
        <div className="quiet-rise relative z-10 mx-auto w-full max-w-5xl text-center">
          <p className="mb-5 text-[0.65rem] font-medium uppercase tracking-[0.34em] text-gold-soft md:text-xs">Ahmedabad · 20 October 2026</p>
          <h1 className="font-display text-5xl font-normal leading-[0.92] md:text-8xl lg:text-9xl">The unveiling<br /><span className="italic text-gold-soft">awaits.</span></h1>
          <div className="gold-rule mx-auto my-8 h-px w-40 md:w-64" />
          <div className="mx-auto grid max-w-xl grid-cols-4" aria-label="Countdown to the opening">
            {Object.entries(countdown).map(([label, value]) => (
              <div key={label} className="border-r border-ivory/20 px-1 last:border-r-0">
                <strong className="block font-display text-3xl font-normal md:text-5xl">{String(value).padStart(2, "0")}</strong>
                <span className="mt-1 block text-[0.55rem] uppercase tracking-[0.2em] text-ivory/60 md:text-[0.65rem]">{label}</span>
              </div>
            ))}
          </div>
          <a href="#venue" className="mt-9 inline-flex flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.24em] text-ivory/70 transition-colors hover:text-gold-soft">
            Discover <ArrowDown size={15} strokeWidth={1} />
          </a>
        </div>
      </section>

      <section id="venue" className="px-5 py-20 text-center md:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-primary">A new address for timeless beauty</p>
          <h2 className="mt-5 font-display text-5xl font-normal leading-none md:text-7xl">Where heritage<br />finds a new home.</h2>
          <button type="button" onClick={() => setVenueOpen((open) => !open)} aria-expanded={venueOpen} className="mx-auto mt-10 inline-flex min-h-12 items-center gap-3 border border-primary px-7 text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <MapPin size={17} strokeWidth={1.4} /> {venueOpen ? "Hide the address" : "Reveal the venue"}
          </button>
          <div className={`mx-auto grid max-w-xl transition-all duration-700 ${venueOpen ? "mt-10 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <address className="font-display text-2xl not-italic leading-relaxed text-foreground/80 md:text-3xl">{address}</address>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary">Open in maps <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>

      <section id="invitation" className="invitation-band px-5 py-20 text-ivory md:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1fr_0.9fr] md:items-end md:gap-20">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-gold-soft">An intimate first look</p>
            <h2 className="mt-5 font-display text-5xl font-normal leading-none md:text-7xl">Your special<br /><span className="italic text-gold-soft">invitation.</span></h2>
            <p className="mt-7 max-w-md text-sm font-light leading-7 text-ivory/65">Be among the first to experience MVZA Jewels at our grand opening. Leave your details and our team will be in touch.</p>
          </div>
          <form onSubmit={submitInvitation} className="space-y-7" aria-label="Request an opening invitation">
            <label className="block"><span className="text-[0.6rem] uppercase tracking-[0.22em] text-gold-soft">Your name</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" className="mt-2 w-full border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-base text-ivory outline-none placeholder:text-ivory/30 focus:border-gold" placeholder="Full name" /></label>
            <label className="block"><span className="text-[0.6rem] uppercase tracking-[0.22em] text-gold-soft">Phone number</span><input name="phone" required minLength={8} maxLength={20} type="tel" autoComplete="tel" className="mt-2 w-full border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-base text-ivory outline-none placeholder:text-ivory/30 focus:border-gold" placeholder="+91" /></label>
            <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 w-full items-center justify-center bg-gold px-7 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft disabled:opacity-60">{status === "sending" ? "Reserving…" : "Request my invitation"}</button>
            <p className="min-h-5 text-center text-xs text-gold-soft" aria-live="polite">{status === "success" ? "Thank you. Your invitation request has been received." : status === "error" ? "We couldn’t save your request. Please try again." : ""}</p>
          </form>
        </div>
      </section>

      <footer className="bg-ink px-5 py-8 text-ivory/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 border-t border-ivory/10 pt-8 sm:flex-row">
          <p className="font-display text-lg text-gold-soft">MVZA JEWELS</p>
          <p className="text-[0.6rem] uppercase tracking-[0.2em]">Antique gold jewellery · Ahmedabad</p>
          <div className="flex gap-5">
            <a href="https://www.instagram.com/mvzajewels" target="_blank" rel="noreferrer" aria-label="MVZA Jewels on Instagram" className="transition-colors hover:text-gold-soft"><Instagram size={18} strokeWidth={1.3} /></a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="MVZA Jewels on Facebook" className="transition-colors hover:text-gold-soft"><Facebook size={18} strokeWidth={1.3} /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}
