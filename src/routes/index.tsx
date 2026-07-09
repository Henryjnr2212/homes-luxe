import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useCMS } from "../lib/cms-context";
import { supabase } from "../lib/supabase";
import prop1 from "@/assets/prop-1.jpg";
import emailjs from "@emailjs/browser";
import { PropertyModal, type ResolvedListing } from "../lib/property-modal";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Send,
  ArrowRight,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize2,
} from "lucide-react";
import logo from "@/assets/logo.png";
import heroDay from "@/assets/hero-day.jpg";
import heroNight from "@/assets/hero-night.jpg";
import prop4 from "@/assets/prop-4.jpg";
import prop5 from "@/assets/prop-5.jpg";

export const Route = createFileRoute("/")({ component: Landing });

type Mode = "day" | "night";

const NAV_LINKS = ["Story", "Mission", "Contact"];

function Landing() {
  const [mode, setMode] = useState<Mode>("day");
  const [selectedProperty, setSelectedProperty] = useState<ResolvedListing | null>(null);
  const { data } = useCMS();
  const reduce = useReducedMotion();

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("night", mode === "night");
  }, [mode]);

  useEffect(() => {
    const accepted = localStorage.getItem("josel_privacy_accepted");
    if (!accepted) {
      setHasAcceptedPrivacy(false);
    }
  }, []);

  const handleAcceptPrivacy = () => {
    localStorage.setItem("josel_privacy_accepted", "true");
    setHasAcceptedPrivacy(true);
  };

  const mappedListings: ResolvedListing[] = data.listings.map((l) => ({
    ...l,
    img: l.imgUrl || prop1,
    images: [l.imgUrl || prop1],
  }));

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <Nav mode={mode} setMode={setMode} />
      <Hero mode={mode} setMode={setMode} reduce={!!reduce} />
      <Gallery listings={mappedListings} onSelectProperty={setSelectedProperty} />
      <Story />
      <MissionVision />
      <CTA />
      <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {/* Property Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            inquireHref="#contact"
          />
        )}
      </AnimatePresence>

      {/* Privacy Notice Modal */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <PrivacyModal onClose={() => setIsPrivacyOpen(false)} />
        )}
      </AnimatePresence>

      {/* Cookie / Privacy Consent Banner */}
      <AnimatePresence>
        {!hasAcceptedPrivacy && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed bottom-4 left-4 right-4 z-40 bg-[#0d0f14]/85 backdrop-blur-md border border-border/85 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1400px] mx-auto"
          >
            <div className="text-xs sm:text-sm text-slate-300 font-light max-w-3xl leading-relaxed">
              We use cookies and process minimal inquiry data to elevate your luxury home search
              experience. By continuing to browse, you agree to our privacy terms.{" "}
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="text-gold hover:underline font-normal bg-transparent border-none p-0 outline-none cursor-pointer"
              >
                Read Privacy Policy
              </button>
            </div>
            <button
              onClick={handleAcceptPrivacy}
              className="w-full md:w-auto shrink-0 inline-flex items-center justify-center bg-gold text-navy-deep hover:bg-white hover:text-black rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer shadow-md"
            >
              Accept & Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ---------------- NAV ---------------- */
function Nav({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const [open, setOpen] = useState(false);
  const { data } = useCMS();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const cleanPhone = data.contact.phone.replace(/\s+/g, "");

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 py-3 sm:py-5">
        <div className="flex items-center justify-between gap-3 rounded-full border border-border/60 bg-background/70 backdrop-blur-xl pl-3 pr-2 sm:pl-4 sm:pr-3 md:pl-5 md:pr-4 py-2 transition-all duration-1000">
          {/* LOGO */}
          <a href="#top" className="flex items-center gap-3 min-w-0">
            <span className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center bg-transparent">
              <img
                src={logo}
                alt="Josel Homes"
                decoding="async"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
              />
            </span>
            <span className="flex flex-col leading-none min-w-0">
              <span className="font-sans text-xs sm:text-sm tracking-[0.3em] font-light truncate uppercase">
                JOSEL HOMES
              </span>
              <span className="text-[8px] tracking-[0.2em] text-muted-foreground uppercase mt-1 font-sans">
                Est. 2020
              </span>
            </span>
          </a>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-sans tracking-[0.25em] uppercase font-light">
            <Link
              to="/listings"
              className="text-foreground/60 hover:text-foreground transition-all duration-300"
            >
              Listings
            </Link>
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-foreground/60 hover:text-foreground transition-all duration-300"
              >
                {l}
              </a>
            ))}
          </nav>

          {/* CTA + HAMBURGER */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setMode(mode === "day" ? "night" : "day")}
              aria-label="Toggle day/night theme"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-[#0d0f14]/40 hover:bg-[#141822] text-foreground hover:text-gold transition-all duration-300 cursor-pointer"
            >
              {mode === "day" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <a
              href={`tel:${cleanPhone}`}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-navy-deep hover:bg-navy text-white text-xs px-5 py-2.5 transition-colors tracking-widest uppercase font-sans font-semibold border border-white/10"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              {data.contact.phone}
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-border bg-background/60 backdrop-blur"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 top-0 z-30 bg-background/95 backdrop-blur-xl pt-24 px-6"
          >
            {/* Close Button inside Drawer */}
            <div className="absolute top-5 right-6">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background/60 backdrop-blur text-foreground cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col divide-y divide-border"
            >
              <Link
                to="/listings"
                onClick={() => setOpen(false)}
                className="font-display text-3xl py-5 flex items-center justify-between hover:text-gold transition-colors border-b border-border"
              >
                Listings
                <ArrowRight size={22} className="opacity-40" />
              </Link>
              {NAV_LINKS.map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl py-5 flex items-center justify-between hover:text-gold transition-colors"
                >
                  {l}
                  <ArrowRight size={22} className="opacity-40" />
                </a>
              ))}
            </motion.nav>
            <a
              href={`tel:${cleanPhone}`}
              onClick={() => setOpen(false)}
              className="mt-10 w-full inline-flex items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground px-6 py-4 text-sm"
            >
              <Phone size={16} /> Call {data.contact.phone}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero({
  mode,
  setMode,
  reduce,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  reduce: boolean;
}) {
  const { data } = useCMS();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemTop = {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  const itemLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 90, damping: 14 },
    },
  };

  const itemRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 90, damping: 14 },
    },
  };

  const itemBottom = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 16 },
    },
  };

  const btnLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 110, damping: 15 },
    },
  };

  const btnRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 110, damping: 15 },
    },
  };

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 md:px-10 overflow-hidden transition-colors duration-1000 bg-background text-foreground"
    >
      {/* 1. Backdrop Image Wrapper (z-0) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={mode}
            src={mode === "day" ? heroDay : heroNight}
            alt="Featured Josel Homes architectural villa backdrop"
            fetchPriority="high"
            decoding="sync"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Complete Text Visibility Guard: Dark neutral backdrop overlay vignette */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none transition-all duration-1000" />

        {/* Complete Text Visibility Guard: Subtle linear gradient background veil layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none transition-all duration-1000" />

        {/* Subtle dark bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 pointer-events-none" />
      </div>

      {/* 2. Content Overlay (z-10) - text sits directly on background */}
      <div className="mx-auto max-w-[900px] w-full relative z-10 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-center flex flex-col items-center justify-center p-0 transition-all duration-1000"
        >
          {/* Soft tag - slides down */}
          <motion.div
            variants={itemTop}
            className="flex items-center gap-3 text-[10px] sm:text-xs tracking-[0.28em] uppercase text-gold mb-6 sm:mb-8 font-sans font-light"
          >
            <span className="h-px w-8 bg-gold/50" />
            {data.hero.tag}
            <span className="h-px w-8 bg-gold/50" />
          </motion.div>

          {/* Headline - lines come together from sides */}
          <h1 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.08] font-medium tracking-tight max-w-[800px] text-white">
            <motion.span variants={itemLeft} className="block">
              {data.hero.title1}
            </motion.span>
            <motion.span
              variants={itemRight}
              className="block italic font-normal text-gold-gradient"
            >
              {data.hero.title2}
            </motion.span>
          </h1>

          {/* Subheadline - slides up */}
          <motion.p
            variants={itemBottom}
            className="mt-6 sm:mt-8 max-w-2xl text-center text-sm sm:text-base md:text-lg text-slate-100 font-sans font-light leading-relaxed"
          >
            {data.hero.subtitle}
          </motion.p>

          {/* Buttons - come together from sides */}
          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center items-center gap-4 overflow-hidden py-2">
            <motion.a
              variants={btnLeft}
              href="#listings"
              className="inline-flex items-center justify-center rounded-full bg-gold hover:bg-gold-soft text-navy-deep text-xs px-8 py-3.5 tracking-widest uppercase font-sans font-semibold border border-white/10 shadow-lg hover:shadow-xl transition-all duration-1000"
            >
              Browse Listings
            </motion.a>
            <motion.a
              variants={btnRight}
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/40 hover:border-white text-white text-xs px-8 py-3.5 tracking-widest uppercase font-sans font-medium transition-all duration-1000"
            >
              Schedule a Call
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Theme Switcher Pill floating over lower-left of the backdrop area */}
      <div className="absolute bottom-8 left-6 sm:left-10 z-20">
        <div className="flex items-center rounded-full border border-border/40 bg-background/80 backdrop-blur-xl p-1 shadow-2xl transition-colors duration-1000">
          {(["day", "night"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative px-4 py-2 rounded-full text-[10px] sm:text-xs tracking-[0.15em] uppercase font-sans font-semibold transition-colors duration-300 flex items-center gap-2 ${
                mode === m ? "text-navy-deep font-bold" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {mode === m && (
                <motion.span
                  layoutId="hero-active-pill"
                  className="absolute inset-0 rounded-full bg-gold"
                  transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {m === "day" ? (
                  <>
                    <Sun size={12} className="stroke-[2]" />
                    Day
                  </>
                ) : (
                  <>
                    <Moon size={12} className="stroke-[2]" />
                    Night
                  </>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
function Gallery({
  listings,
  onSelectProperty,
}: {
  listings: ResolvedListing[];
  onSelectProperty: (p: ResolvedListing) => void;
}) {
  const extendedListings = [...listings, ...listings, ...listings];

  const trackRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(listings.length);
  const [hasTransition, setHasTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Stagger reveal animation for the section headers
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  useEffect(() => {
    setCurrentIndex(listings.length);
    setTimeout(updateOffsets, 150);
  }, [listings.length]);

  // Measure card positions (offsetLeft) dynamically
  const updateOffsets = () => {
    if (trackRef.current) {
      const cards = Array.from(trackRef.current.children) as HTMLElement[];
      const computedOffsets = cards.map((card) => card.offsetLeft);
      setOffsets(computedOffsets);
    }
  };

  useLayoutEffect(() => {
    const timer = setTimeout(updateOffsets, 150);
    window.addEventListener("resize", updateOffsets);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateOffsets);
    };
  }, [listings]);

  // Snap transition on route resets or fresh state setups
  useEffect(() => {
    if (!hasTransition) {
      const raft = requestAnimationFrame(() => {
        setHasTransition(true);
      });
      return () => cancelAnimationFrame(raft);
    }
  }, [hasTransition]);

  const handleAnimationComplete = () => {
    setIsTransitioning(false);

    // Circular infinite loop wrap boundaries:
    if (currentIndex >= listings.length * 2) {
      setHasTransition(false);
      setCurrentIndex((prev) => prev - listings.length);
    } else if (currentIndex < listings.length) {
      setHasTransition(false);
      setCurrentIndex((prev) => prev + listings.length);
    }
  };

  // Drag physics snapping
  const onDragEnd = (event: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (offsets.length === 0) return;

    const targetX = -offsets[currentIndex] + info.offset.x;

    let closestIndex = currentIndex;
    let minDiff = Infinity;
    for (let i = 0; i < offsets.length; i++) {
      const diff = Math.abs(-targetX - offsets[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    const velocityX = info.velocity.x;
    const swipeThreshold = 300;
    if (velocityX < -swipeThreshold && currentIndex < extendedListings.length - 1) {
      closestIndex = Math.min(currentIndex + 1, extendedListings.length - 1);
    } else if (velocityX > swipeThreshold && currentIndex > 0) {
      closestIndex = Math.max(currentIndex - 1, 0);
    }

    setIsTransitioning(true);
    setCurrentIndex(closestIndex);
  };

  const currentTranslateX = offsets.length > 0 ? -offsets[currentIndex] : 0;

  return (
    <section
      id="listings"
      className="relative py-20 sm:py-32 border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mb-10 sm:mb-16">
        <div className="grid md:grid-cols-[minmax(0,1fr)_auto] gap-6 md:gap-8 items-end">
          <div className="min-w-0">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="space-y-4"
            >
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3 text-[10px] sm:text-xs tracking-[0.28em] uppercase text-muted-foreground"
              >
                <span className="h-px w-10 bg-gold" /> Current collection
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="font-display text-3xl sm:text-4xl md:text-6xl leading-[1] tracking-tight max-w-2xl"
              >
                Residences across{" "}
                <em className="text-gold-gradient not-italic font-medium">Accra</em> and the{" "}
                <em className="italic">Volta Region</em>.
              </motion.h2>
            </motion.div>
          </div>

          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            Each property is hand-selected, styled and staged by our in-house design studio. Scroll
            to discover the collection.
          </p>
        </div>
      </div>

      {/* Draggable infinite listings track wrapper */}
      <div className="marquee-mask overflow-hidden relative max-h-[640px] sm:max-h-[660px]">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -(offsets[offsets.length - 1] || 10000), right: 0 }}
          dragElastic={0.2}
          dragMomentum={true}
          dragTransition={{ power: 0.18, timeConstant: 250 }}
          onDragEnd={onDragEnd}
          animate={{ x: currentTranslateX }}
          transition={
            hasTransition
              ? { type: "spring" as const, stiffness: 120, damping: 20 }
              : { duration: 0 }
          }
          onAnimationComplete={handleAnimationComplete}
          className="flex gap-6 sm:gap-8 w-max cursor-grab active:cursor-grabbing pl-4 sm:pl-6 md:pl-10 py-6"
          style={{ x: currentTranslateX }}
        >
          {extendedListings.map((l, i) => (
            <PropertyCard key={i} {...l} idx={i} onSelect={() => onSelectProperty(l)} />
          ))}
        </motion.div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mt-10 sm:mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground">
        <span>{listings.length} live listings</span>
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 rounded-full border border-gold/40 hover:border-gold bg-gold/5 hover:bg-gold/10 text-gold px-7 py-3 text-[11px] tracking-widest uppercase font-sans font-semibold transition-all duration-300 shadow-sm hover:shadow-gold/10"
        >
          View All Properties <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

const HEIGHT_MAP: Record<number, string> = {
  0: "h-[380px] sm:h-[480px]",
  1: "h-[420px] sm:h-[560px]",
  2: "h-[360px] sm:h-[440px]",
  3: "h-[400px] sm:h-[520px]",
};

const WIDTH_MAP: Record<number, string> = {
  0: "w-[240px] sm:w-[320px]",
  1: "w-[280px] sm:w-[380px]",
  2: "w-[260px] sm:w-[340px]",
};

function PropertyCard({
  img,
  name,
  region,
  price,
  tag,
  shape,
  idx,
  onSelect,
}: ResolvedListing & { idx: number; onSelect: () => void }) {
  const isArch = shape === "arch";
  const h = HEIGHT_MAP[idx % 4];
  const w = WIDTH_MAP[idx % 3];
  const offset = idx % 2 === 0 ? "translate-y-0" : "translate-y-4 sm:translate-y-8";

  return (
    <motion.div
      onClick={onSelect}
      whileHover="hover"
      className={`group relative shrink-0 ${w} ${h} ${offset} max-w-[280px] sm:max-w-[350px] block text-left cursor-pointer focus:outline-none`}
    >
      <div
        className="relative w-full h-full overflow-hidden bg-muted"
        style={{
          borderRadius: isArch ? "50% 50% 1.5rem 1.5rem / 22% 22% 1.5rem 1.5rem" : "1.5rem",
        }}
      >
        <motion.img
          variants={{ hover: { scale: 1.08 } }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const }}
          src={img}
          alt={name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy-deep/75 via-navy-deep/10 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="rounded-full bg-background/80 backdrop-blur text-foreground text-[10px] tracking-widest uppercase px-3 py-1.5">
            {tag}
          </span>
          <span className="rounded-full bg-gold text-navy-deep text-[10px] tracking-widest uppercase px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            View →
          </span>
        </div>

        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/70">{region}</div>
          <div className="mt-1 flex items-end justify-between gap-3">
            <div className="font-display text-xl sm:text-2xl leading-tight">{name}</div>
            <div className="text-xs sm:text-sm font-medium text-gold-soft">{price}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- STORY & HERITAGE ---------------- */
function Story() {
  const { data } = useCMS();
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const imageReveal = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="story"
      className="relative py-20 sm:py-32 border-t border-border overflow-hidden bg-background"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 space-y-24 sm:space-y-36">
        {/* PART 1: ABOUT US */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="lg:col-span-6 space-y-6 sm:space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-3 text-xs tracking-[0.28em] uppercase text-muted-foreground"
            >
              <span className="h-px w-10 bg-gold" /> About Us
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-tight text-foreground font-medium"
            >
              {data.about.aboutUsHeading}
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="space-y-4 text-base sm:text-lg leading-relaxed text-muted-foreground font-light"
            >
              <p className="text-foreground font-medium">{data.about.aboutUsText1}</p>
              <p>{data.about.aboutUsText2}</p>
              <p>{data.about.aboutUsText3}</p>
            </motion.div>
          </motion.div>

          {/* Photo block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageReveal}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-muted shadow-2xl border border-border/40 group">
              <img
                src={prop4}
                alt="Josel Homes premium interior design layout"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/20 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* PART 2: COMPANY HERITAGE (HISTORY) */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Photo block (left on desktop) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageReveal}
            className="lg:col-span-6 lg:order-1 order-2"
          >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-muted shadow-2xl border border-border/40 group">
              <img
                src={prop5}
                alt="Josel Homes architecture and estate development"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/20 to-transparent" />
            </div>
          </motion.div>

          {/* Text block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="lg:col-span-6 space-y-6 sm:space-y-8 lg:order-2 order-1"
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-3 text-xs tracking-[0.28em] uppercase text-muted-foreground"
            >
              <span className="h-px w-10 bg-gold" /> Our Story
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-tight"
            >
              {data.about.ourStoryHeading}
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="space-y-4 text-base sm:text-lg leading-relaxed text-muted-foreground font-light"
            >
              <p className="text-foreground font-medium">{data.about.ourStoryText1}</p>
              <p>{data.about.ourStoryText2}</p>
              <p>{data.about.ourStoryText3}</p>
            </motion.div>

            {/* Stats list */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-6 pt-6 sm:pt-8 border-t border-border"
            >
              {[
                ["2020", "Established"],
                ["Accra", "Accra & Volta"],
                ["120+", "Delivered"],
                ["18", "Specialists"],
                ["4.9", "Client Rating"],
                ["100%", "Referral-Driven"],
              ].map(([n, l]) => (
                <div key={l} className="space-y-1">
                  <div className="font-display text-2xl sm:text-3xl text-foreground font-semibold">
                    {n}
                  </div>
                  <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-muted-foreground">
                    {l}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MissionVision() {
  const { data } = useCMS();
  const cardLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const cardRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="mission"
      className="relative py-20 sm:py-32 border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        <div className="flex items-center gap-3 text-xs tracking-[0.28em] uppercase text-muted-foreground mb-6">
          <span className="h-px w-10 bg-gold" /> Strategic focus
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.02] tracking-tight max-w-3xl mb-10 sm:mb-16">
          The principles that shape every Josel Homes residence.
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardLeft}
            className="relative rounded-[1.25rem] sm:rounded-[1.5rem] p-6 sm:p-8 md:p-12 bg-card border border-gold/40"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                — Our Mission
              </span>
              <span className="h-2 w-2 rounded-full bg-gold" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.05] tracking-tight max-w-md">
              {data.missionVision.missionHeading}
            </h3>
            <p className="mt-4 sm:mt-6 text-muted-foreground leading-relaxed max-w-md font-light text-sm sm:text-base">
              {data.missionVision.missionText}
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardRight}
            className="relative rounded-[1.25rem] sm:rounded-[1.5rem] p-6 sm:p-8 md:p-12 bg-card border border-navy/30"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                — Our Vision
              </span>
              <span className="h-2 w-2 rounded-full bg-navy" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.05] tracking-tight max-w-md">
              {data.missionVision.visionHeading}
            </h3>
            <p className="mt-4 sm:mt-6 text-muted-foreground leading-relaxed max-w-md font-light text-sm sm:text-base">
              {data.missionVision.visionText}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const { data } = useCMS();
  const cleanPhone = data.contact.phone.replace(/\s+/g, "");
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative py-20 sm:py-32 border-t border-border overflow-hidden bg-background">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 text-center"
      >
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-center gap-3 text-xs tracking-[0.28em] uppercase text-muted-foreground mb-6 sm:mb-8"
        >
          <span className="h-px w-10 bg-gold" /> The Josel Signature
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          className="font-display text-[clamp(2.25rem,9vw,8rem)] leading-[0.9] tracking-[-0.03em]"
        >
          Built on <em className="italic text-gold-gradient not-italic md:italic">trust</em>,
          <br className="hidden md:block" /> styled <em className="italic">for</em> you.
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-light leading-relaxed"
        >
          Speak with our concierge team. Private viewings across Accra and the Volta Region are
          available by appointment.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Phone size={14} />
            Call {data.contact.phone}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 sm:px-7 py-3.5 sm:py-4 text-sm hover:border-foreground/60 transition-colors"
          >
            Send a message
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------------- CONTACT FORM ---------------- */
const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your name" }).max(80),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(160),
  phone: z.string().trim().max(30).optional(),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message should be at least 10 characters" })
    .max(1000),
});
type ContactValues = z.infer<typeof contactSchema>;
type ContactErrors = Partial<Record<keyof ContactValues, string>>;

function ContactForm() {
  const [values, setValues] = useState<ContactValues>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const { data } = useCMS();

  const set =
    (k: keyof ContactValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [k]: e.target.value }));
      if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      toast.error("Please accept the data processing consent to proceed");
      return;
    }
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: ContactErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      // 1. Insert inquiry into Supabase (primary — must succeed)
      const { error: dbError } = await supabase.from("inquiries").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
      });

      if (dbError) throw dbError;

      // 3. Setup Explicit Constants
      const SERVICE_ID = "service_vo9lny9";
      const TEMPLATE_ID = "template_lj3zymf";
      const PUBLIC_KEY = "ooUr_qPG9rvvCD4A5";

      const templateParams = {
        name: parsed.data.name,
        phone: parsed.data.phone || "N/A",
        email: parsed.data.email,
        message: parsed.data.message,
      };

      console.log("Form data payload payload being sent to EmailJS:", templateParams);

      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then((res) => console.log("🔥 EmailJS Sent Successfully!", res.status, res.text))
        .catch((err) => console.error("❌ EmailJS Failed to Send:", err));

      // 2. Supabase succeeded — show success toast and clear form immediately
      toast.success("Enquiry submitted successfully! A Josel specialist will reach out shortly.");
      setValues({ name: "", email: "", phone: "", message: "" });
      setConsentChecked(false);
    } catch (err) {
      // Only fires if Supabase insertion itself failed
      const msg =
        err instanceof Error ? err.message : "Submission failed. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-gold/30 bg-card/60 backdrop-blur p-6 sm:p-8 md:p-10 space-y-6"
    >
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          — Private Concierge
        </div>
        <h3 className="mt-2 font-display text-2xl sm:text-3xl leading-tight">
          Speak with a Josel <em className="italic text-gold-gradient not-italic">specialist</em>.
        </h3>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="cf-name"
          className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2"
        >
          Full name
        </label>
        <input
          id="cf-name"
          type="text"
          value={values.name}
          onChange={set("name")}
          maxLength={80}
          className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 text-sm transition-colors"
          placeholder="Your full name"
        />
        {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Email + Phone row */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="cf-email"
            className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2"
          >
            Email address
          </label>
          <input
            id="cf-email"
            type="email"
            value={values.email}
            onChange={set("email")}
            maxLength={160}
            className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 text-sm transition-colors"
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label
            htmlFor="cf-phone"
            className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2"
          >
            Phone number <span className="normal-case italic">(optional)</span>
          </label>
          <input
            id="cf-phone"
            type="tel"
            value={values.phone ?? ""}
            onChange={set("phone")}
            maxLength={30}
            className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 text-sm transition-colors"
            placeholder={data.contact.phone}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="cf-message"
          className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2"
        >
          Message
        </label>
        <textarea
          id="cf-message"
          rows={4}
          value={values.message}
          onChange={set("message")}
          maxLength={1000}
          className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 text-sm resize-none transition-colors"
          placeholder="Tell us about the residence you're looking for…"
        />
        {errors.message && <p className="mt-2 text-xs text-red-500">{errors.message}</p>}
      </div>

      {/* Data Privacy Consent Checkbox */}
      <div className="flex items-start gap-3 pt-2">
        <input
          id="privacy-consent"
          type="checkbox"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border/50 bg-transparent text-gold focus:ring-gold focus:ring-offset-slate-900 accent-[#bca374] cursor-pointer"
        />
        <label
          htmlFor="privacy-consent"
          className="text-xs text-muted-foreground/80 leading-relaxed cursor-pointer select-none"
        >
          I consent to the collection and processing of my personal data for the purpose of handling this enquiry.
        </label>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {submitting ? "Sending…" : "Send enquiry"}
          <Send size={14} />
        </button>
        <span className="text-[10px] text-muted-foreground">
          Your enquiry is logged securely. We respond within 24 hours.
        </span>
      </div>
    </form>
  );
}

function TiktokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

/* ---------------- FOOTER ---------------- */
const SOCIALS = [
  { icon: Facebook, href: "https://www.facebook.com/share/1D2Ni5gHEZ/?mibextid=wwXIfr", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/joselhomes?igsh=MXVxcXA0bTU1NTg2MA==", label: "Instagram" },
  { icon: TiktokIcon, href: "https://tiktok.com/@JOSELHOMES", label: "TikTok" },
];

function SocialsAndLinks({ onOpenPrivacy }: { onOpenPrivacy: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Follow the house
        </div>
        <div className="flex flex-wrap gap-3">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid h-11 w-11 place-items-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm pt-2">
        {NAV_LINKS.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {l}
          </a>
        ))}
        <button
          onClick={onOpenPrivacy}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-normal bg-transparent border-none p-0 outline-none"
        >
          Privacy
        </button>
      </nav>
    </div>
  );
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-2xl bg-background text-foreground rounded-[2rem] border border-border p-6 sm:p-10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 grid h-8 w-8 place-items-center rounded-full bg-border/20 hover:bg-border/40 text-foreground transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="space-y-6">
          <div>
            <span className="rounded-full bg-gold/15 text-gold text-[10px] tracking-widest uppercase font-semibold px-3.5 py-1.5 inline-block mb-3">
              Privacy Policy
            </span>
            <h3 className="font-display text-2xl tracking-tight leading-none text-white">
              JOSEL HOMES – PRIVACY POLICY
            </h3>
            <p className="text-[10px] text-muted-foreground/60 font-mono mt-1">
              Last Updated: July 2026
            </p>
          </div>

          <div
            className="max-h-[60vh] overflow-y-auto pr-4 space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed font-light scrollbar-thin"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(188, 163, 116, 0.3) transparent",
            }}
          >
            <p>
              At Josel Homes, accessible from{" "}
              <a
                href="https://www.joselhomes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                https://www.joselhomes.com
              </a>
              , one of our main priorities is the privacy of our visitors. This Privacy Policy
              document contains types of information that is collected and recorded by Josel
              Homes and how we use it. If you have additional questions or require more
              information about our Privacy Policy, do not hesitate to contact us.
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">
                1. INFORMATION WE COLLECT
              </h4>
              <p>
                The personal information that you are asked to provide, and the reasons why you
                are asked to provide it, will be made clear to you at the point we ask you to
                provide your personal information.
              </p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>
                  When you fill out our Private Concierge Inquiry Form, we collect your Full
                  Name, Email Address, Phone Number, and the specific details of your real estate
                  message or residential property requirements.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">
                2. HOW WE USE YOUR INFORMATION
              </h4>
              <p>We use the information we collect in various ways, including to:</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>Provide, operate, and maintain our premium real estate concierge services.</li>
                <li>Improve, personalize, and expand our website property showcases.</li>
                <li>Understand and analyze how you interact with our luxury listing assets.</li>
                <li>
                  Communicate with you, either directly or through one of our specialists, to
                  provide you with updates and details relating to your property inquiry.
                </li>
                <li>
                  Log, process, and secure your inquiry within our internal Administrative
                  Ledger for portfolio management.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">
                3. DATA RETENTION AND SECURITY
              </h4>
              <p>We treat client data with the utmost discretion and confidentiality.</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>
                  Your submission details are stored securely using encrypted cloud database
                  structures (Supabase) and routed via authenticated API systems (EmailJS).
                </li>
                <li>
                  We retain your personal information only for as long as necessary to fulfill your
                  property search or active real estate engagement.
                </li>
                <li>
                  We do not sell, rent, lease, or share your private contact information with
                  outside third-party marketing networks or corporate data brokers under any
                  circumstances.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">
                4. YOUR DATA PRIVACY RIGHTS
              </h4>
              <p>
                We want to make sure you are fully aware of all of your data protection rights.
                Every user is entitled to the following:
              </p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>
                  <strong>The Right to Access:</strong> You have the right to request copies of
                  your personal data held in our registry.
                </li>
                <li>
                  <strong>The Right to Rectification:</strong> You have the right to request
                  that we correct any information you believe is inaccurate or incomplete.
                </li>
                <li>
                  <strong>The Right to Erasure:</strong> You have the right to request that we
                  permanently delete your personal data from our administrative databases once your
                  inquiry is settled.
                </li>
              </ul>
              <p className="mt-2">
                If you make a request regarding these rights, we have one month to respond to you.
                To exercise any of these rights, please contact a Josel Homes specialist.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Footer({ onOpenPrivacy }: { onOpenPrivacy: () => void }) {
  const { data } = useCMS();
  const navigate = useNavigate();
  const clickTimesRef = useRef<number[]>([]);

  const handleTripleClickOrTap = (e: React.MouseEvent) => {
    const now = Date.now();
    const times = clickTimesRef.current;
    times.push(now);
    if (times.length > 3) {
      times.shift();
    }
    if (times.length === 3 && times[2] - times[0] < 800) {
      clickTimesRef.current = [];
      toast.info("Entering Admin Portal...");
      navigate({ to: "/admin-portal" });
    }
  };

  const cleanPhone = data.contact.phone.replace(/\s+/g, "");

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <footer
      id="contact"
      className="relative border-t border-border pt-16 sm:pt-20 pb-28 sm:pb-36 px-4 sm:px-6 md:px-10"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-12 lg:gap-16"
      >
        {/* LEFT: Brand + info */}
        <motion.div variants={fadeInUp} className="space-y-8">
          {/* Circular click/tap target container wrapper */}
          <div onClick={handleTripleClickOrTap} className="select-none space-y-8 cursor-default">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 sm:h-20 sm:w-20 shrink-0 place-items-center bg-transparent">
                <img
                  src={logo}
                  alt="Josel Homes"
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                />
              </span>
              <div className="min-w-0">
                <div className="font-display text-2xl sm:text-3xl tracking-wide">JOSEL HOMES</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-1">
                  Built on trust · Styled for you
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed font-light">
              A premium Ghanaian residential house delivering signature homes across Accra and the
              Volta Region since 2020.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Phone size={14} className="text-gold" /> {data.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${data.contact.email}`}
                className="inline-flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Mail size={14} className="text-gold" /> {data.contact.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-3 text-muted-foreground">
              <MapPin size={14} className="text-gold" /> Accra · Volta Region, Ghana
            </li>
          </ul>

          <div className="hidden lg:block">
            <SocialsAndLinks onOpenPrivacy={onOpenPrivacy} />
          </div>
        </motion.div>

        {/* RIGHT: Form */}
        <motion.div variants={fadeInUp} className="space-y-12">
          <ContactForm />
          <div className="block lg:hidden pt-8 border-t border-border/60">
            <SocialsAndLinks onOpenPrivacy={onOpenPrivacy} />
          </div>
        </motion.div>
      </motion.div>

      {/* TAGLINE */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="mx-auto max-w-[1400px] mt-16 pt-8 border-t border-border"
      >
        <motion.div variants={fadeInUp} className="w-full overflow-hidden marquee-mask py-4">
          <div className="flex w-max animate-[marquee_25s_linear_infinite] gap-12">
            <span className="font-display text-[clamp(1.5rem,5vw,3.5rem)] tracking-[0.2em] uppercase whitespace-nowrap">
              BUILT · ON · TRUST · STYLED · FOR · YOU
            </span>
            <span className="font-display text-[clamp(1.5rem,5vw,3.5rem)] tracking-[0.2em] uppercase whitespace-nowrap">
              BUILT · ON · TRUST · STYLED · FOR · YOU
            </span>
          </div>
        </motion.div>
        <motion.div
          variants={fadeInUp}
          className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] tracking-widest uppercase text-muted-foreground gap-2"
        >
          <span>© {new Date().getFullYear()} Josel Homes. All rights reserved.</span>
          <span>Est. 2020 · Accra, Ghana</span>
        </motion.div>
      </motion.div>
    </footer>
  );
}
