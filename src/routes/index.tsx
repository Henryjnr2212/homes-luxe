import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
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
import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import prop4 from "@/assets/prop-4.jpg";
import prop5 from "@/assets/prop-5.jpg";
import prop6 from "@/assets/prop-6.jpg";

export const Route = createFileRoute("/")({ component: Landing });

type Mode = "day" | "night";

const NAV_LINKS = ["Listings", "Story", "Mission", "Contact"];

const LISTINGS = [
  {
    img: prop1,
    images: [prop1, prop2, prop3, prop4],
    name: "Palm Court Villa",
    region: "East Legon, Accra",
    price: "GH₵ 4.2M",
    tag: "Signature",
    shape: "arch" as const,
    beds: 5,
    baths: 6,
    sqft: "7,200",
    description: "A breathtaking contemporary masterwork situated in the heart of East Legon. Featuring expansive double-height ceilings, a private infinity pool, custom Italian kitchen cabinetry, and panoramic views of manicured palms."
  },
  {
    img: prop2,
    images: [prop2, prop3, prop4, prop5],
    name: "Skyline Penthouse",
    region: "Airport Residential",
    price: "GH₵ 6.8M",
    tag: "Featured",
    shape: "rounded" as const,
    beds: 3,
    baths: 3.5,
    sqft: "4,500",
    description: "An ultra-premium duplex penthouse scaling the Accra skyline. Completed with floor-to-ceiling glass walls, wrap-around terraces, smart-home automation, and a direct private elevator lobby."
  },
  {
    img: prop3,
    images: [prop3, prop4, prop5, prop6],
    name: "Volta Lakehouse",
    region: "Akosombo, Volta",
    price: "GH₵ 5.1M",
    tag: "New",
    shape: "arch" as const,
    beds: 4,
    baths: 4.5,
    sqft: "6,100",
    description: "A serene architectural retreat perched on the banks of the Volta Lake in Akosombo. Designed for indoor-outdoor living, with a private jetty, panoramic waterfront glazing, and infinity-edge plunge pool."
  },
  {
    img: prop4,
    images: [prop4, prop5, prop6, prop1],
    name: "The Cantonments House",
    region: "Cantonments, Accra",
    price: "GH₵ 3.4M",
    tag: "Signature",
    shape: "rounded" as const,
    beds: 4,
    baths: 4,
    sqft: "5,200",
    description: "A secure, editorial-standard modern residence in Accra's premier enclave. Boasting minimalist architectural lines, a hidden garden courtyard, premium oak flooring, and high-security integrations."
  },
  {
    img: prop5,
    images: [prop5, prop6, prop1, prop2],
    name: "Noir Suite Residence",
    region: "Ridge, Accra",
    price: "GH₵ 2.9M",
    tag: "Interior",
    shape: "arch" as const,
    beds: 2,
    baths: 2.5,
    sqft: "3,100",
    description: "A sophisticated dark-themed residence capturing urban refinement. Features premium textured marble walls, bespoke brass accents, integrated sub-zero appliances, and a secluded private master garden suite."
  },
  {
    img: prop6,
    images: [prop6, prop1, prop2, prop3],
    name: "Aburi Grand Estate",
    region: "Aburi Hills",
    price: "GH₵ 7.5M",
    tag: "Estate",
    shape: "rounded" as const,
    beds: 6,
    baths: 7.5,
    sqft: "11,800",
    description: "A majestic hillside estate offering sweeping views of Greater Accra from Aburi Hills. Encompasses expansive formal reception halls, a private tennis court, detached guest cottages, and classical architectural scaling."
  },
];

function Landing() {
  const [mode, setMode] = useState<Mode>("day");
  const [selectedProperty, setSelectedProperty] = useState<typeof LISTINGS[number] | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle("night", mode === "night");
  }, [mode]);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <Nav mode={mode} />
      <Hero mode={mode} setMode={setMode} reduce={!!reduce} />
      <Gallery onSelectProperty={setSelectedProperty} />
      <Story />
      <MissionVision />
      <CTA />
      <Footer />
      <DayNightToggle mode={mode} setMode={setMode} />

      <AnimatePresence>
        {selectedProperty && (
          <PropertyModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ---------------- NAV ---------------- */
function Nav({ mode }: { mode: Mode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
            <a
              href="tel:+233244880083"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-navy-deep hover:bg-navy text-white text-xs px-5 py-2.5 transition-colors tracking-widest uppercase font-sans font-semibold border border-white/10"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              0244 880 083
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
              href="tel:+233244880083"
              onClick={() => setOpen(false)}
              className="mt-10 w-full inline-flex items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground px-6 py-4 text-sm"
            >
              <Phone size={16} /> Call 0244 880 083
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
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const itemLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 90, damping: 14 }
    }
  };

  const itemRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 90, damping: 14 }
    }
  };

  const itemBottom = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 16 }
    }
  };

  const btnLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 110, damping: 15 }
    }
  };

  const btnRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 110, damping: 15 }
    }
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
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none transition-all duration-1000"
        />
        
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
            Accra · Volta Region
            <span className="h-px w-8 bg-gold/50" />
          </motion.div>

          {/* Headline - lines come together from sides */}
          <h1 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.08] font-medium tracking-tight max-w-[800px] text-white">
            <motion.span variants={itemLeft} className="block">
              More Than Just Property
            </motion.span>
            <motion.span variants={itemRight} className="block italic font-normal">
              it's Your <span className="text-gold-gradient">Foundation.</span>
            </motion.span>
          </h1>

          {/* Subheadline - slides up */}
          <motion.p
            variants={itemBottom}
            className="mt-6 sm:mt-8 max-w-2xl text-center text-sm sm:text-base md:text-lg text-slate-100 font-sans font-light leading-relaxed"
          >
            A premier real estate firm serving Accra and the Volta region, delivering a high-touch, tailored experience.
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
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
function Gallery({ onSelectProperty }: { onSelectProperty: (p: typeof LISTINGS[number]) => void }) {
  const extendedListings = [...LISTINGS, ...LISTINGS, ...LISTINGS];
  
  const trackRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(LISTINGS.length);
  const [hasTransition, setHasTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Stagger reveal animation for the section headers
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  // Measure card positions (offsetLeft) dynamically so we can handle responsive card sizes and varying custom widths perfectly
  const updateOffsets = () => {
    if (trackRef.current) {
      const cards = Array.from(trackRef.current.children) as HTMLElement[];
      const computedOffsets = cards.map((card) => card.offsetLeft);
      setOffsets(computedOffsets);
    }
  };

  useLayoutEffect(() => {
    // Small delay to ensure browser layout engine has fully rendered and positioned the cards
    const timer = setTimeout(updateOffsets, 150);
    window.addEventListener("resize", updateOffsets);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateOffsets);
    };
  }, []);

  // Snap transition on route resets or fresh state setups
  useEffect(() => {
    if (!hasTransition) {
      const raft = requestAnimationFrame(() => {
        setHasTransition(true);
      });
      return () => cancelAnimationFrame(raft);
    }
  }, [hasTransition]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleAnimationComplete = () => {
    setIsTransitioning(false);
    
    // Circular infinite loop wrap boundaries:
    // Middle copy starts at LISTINGS.length (6) and ends at LISTINGS.length * 2 - 1 (11).
    if (currentIndex >= LISTINGS.length * 2) {
      setHasTransition(false);
      setCurrentIndex((prev) => prev - LISTINGS.length);
    } else if (currentIndex < LISTINGS.length) {
      setHasTransition(false);
      setCurrentIndex((prev) => prev + LISTINGS.length);
    }
  };

  // Drag physics snapping
  const onDragEnd = (event: any, info: any) => {
    if (offsets.length === 0) return;
    
    // Current layout offset coordinate + offset dragging displacement
    const targetX = -offsets[currentIndex] + info.offset.x;
    
    // Find the closest card index based on target projection
    let closestIndex = currentIndex;
    let minDiff = Infinity;
    for (let i = 0; i < offsets.length; i++) {
      const diff = Math.abs(-targetX - offsets[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    // Velocity swipe support for premium fluid swipe physics
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

  // Calculate current translation value dynamically based on computed offsets
  const currentTranslateX = offsets.length > 0 ? -offsets[currentIndex] : 0;

  return (
    <section id="listings" className="relative py-20 sm:py-32 border-t border-border overflow-hidden">
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
              <motion.div variants={fadeInUp} className="flex items-center gap-3 text-[10px] sm:text-xs tracking-[0.28em] uppercase text-muted-foreground">
                <span className="h-px w-10 bg-gold" /> Current collection
              </motion.div>
              <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl md:text-6xl leading-[1] tracking-tight max-w-2xl">
                Residences across{" "}
                <em className="text-gold-gradient not-italic font-medium">Accra</em> and the{" "}
                <em className="italic">Volta Region</em>.
              </motion.h2>
            </motion.div>
          </div>

          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            Each property is hand-selected, styled and staged by our in-house
            design studio. Scroll to discover the collection.
          </p>
        </div>
      </div>

      {/* Draggable infinite listings track wrapper */}
      <div className="marquee-mask overflow-hidden relative">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -(offsets[offsets.length - 1] || 10000), right: 0 }}
          dragElastic={0.2}
          dragMomentum={true}
          dragTransition={{ power: 0.18, timeConstant: 250 }}
          onDragEnd={onDragEnd}
          animate={{ x: currentTranslateX }}
          transition={hasTransition ? { type: "spring", stiffness: 120, damping: 20 } : { duration: 0 }}
          onAnimationComplete={handleAnimationComplete}
          className="flex gap-6 sm:gap-8 w-max cursor-grab active:cursor-grabbing pl-4 sm:pl-6 md:pl-10 py-6"
          style={{ x: currentTranslateX }}
        >
          {extendedListings.map((l, i) => (
            <div key={i} className="property-card-container shrink-0">
              <PropertyCard {...l} idx={i} onSelect={() => onSelectProperty(l)} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mt-10 sm:mt-12 flex justify-between items-center text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground">
        <span>{LISTINGS.length} live listings</span>
        <a
          href="#contact"
          className="text-foreground border-b border-foreground/40 pb-1 hover:border-foreground"
        >
          Request portfolio
        </a>
      </div>
    </section>
  );
}

function PropertyCard({
  img,
  name,
  region,
  price,
  tag,
  shape,
  idx,
  onSelect,
}: (typeof LISTINGS)[number] & { idx: number; onSelect: () => void }) {
  const isArch = shape === "arch";
  const heights = ["h-[380px] sm:h-[480px]", "h-[420px] sm:h-[560px]", "h-[360px] sm:h-[440px]", "h-[400px] sm:h-[520px]"];
  const widths = ["w-[240px] sm:w-[320px]", "w-[280px] sm:w-[380px]", "w-[260px] sm:w-[340px]"];
  const h = heights[idx % heights.length];
  const w = widths[idx % widths.length];
  const offset = idx % 2 === 0 ? "translate-y-0" : "translate-y-4 sm:translate-y-8";

  return (
    <motion.div
      onClick={onSelect}
      whileHover="hover"
      className={`group relative shrink-0 ${w} ${h} ${offset} block text-left cursor-pointer focus:outline-none`}
    >
      <div
        className="relative w-full h-full overflow-hidden bg-muted"
        style={{
          borderRadius: isArch
            ? "50% 50% 1.5rem 1.5rem / 22% 22% 1.5rem 1.5rem"
            : "1.5rem",
        }}
      >
        <motion.img
          variants={{ hover: { scale: 1.08 } }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/70">
            {region}
          </div>
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
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const imageReveal = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="story" className="relative py-20 sm:py-32 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 space-y-24 sm:space-y-36">
        
        {/* PART 1: BRAND OVERVIEW (ABOUT US) */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="lg:col-span-6 space-y-6 sm:space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 text-xs tracking-[0.28em] uppercase text-muted-foreground">
              <span className="h-px w-10 bg-gold" /> About Us
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-tight">
              More Than Just Property — <br />
              <em className="italic text-gold-gradient not-italic">it’s Your Foundation.</em>
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="space-y-4 text-base sm:text-lg leading-relaxed text-muted-foreground font-light">
              <p className="text-foreground font-medium">
                At JOSEL HOMES, we believe that a home is more than bricks and mortar — it is the foundation of your life’s greatest moments, a sanctuary of comfort, and a cornerstone of lasting wealth.
              </p>
              <p>
                Founded on the principles of integrity, refined service, and deep market expertise, JOSEL HOMES is a premier real estate firm dedicated to guiding clients seamlessly through their property journeys.
              </p>
              <p>
                Whether you are securing your first home, upgrading to a luxury estate, or expanding an investment portfolio, we deliver a high-touch, tailored experience. By combining rigorous market insights with a personalized approach, we ensure every transaction is handled with the utmost discretion and professionalism. At JOSEL HOMES, we don’t just close deals; we open doors to new beginnings.
              </p>
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
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="lg:col-span-6 space-y-6 sm:space-y-8 lg:order-2 order-1"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 text-xs tracking-[0.28em] uppercase text-muted-foreground">
              <span className="h-px w-10 bg-gold" /> Our Story
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-tight">
              Our Story: <em className="italic font-normal text-gold-gradient not-italic">Redefining Real Estate</em>
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="space-y-4 text-base sm:text-lg leading-relaxed text-muted-foreground font-light">
              <p className="text-foreground font-medium">
                Established in 2020, JOSEL HOMES was born from a vision to bridge the gap between corporate professionalism and genuine, relationship-driven service.
              </p>
              <p>
                Starting as a boutique team of property experts serving Accra and the Volta region, our goal was simple: to redefine the property transition experience. Through transparent dealings and an unwavering commitment to our clients' success, we have steadily grown into a trusted industry name.
              </p>
              <p>
                Today, we stand as a forward-thinking firm that honors its roots while constantly innovating to shape the future of real estate in Africa.
              </p>
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
                  <div className="font-display text-2xl sm:text-3xl text-foreground font-semibold">{n}</div>
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

/* ---------------- MISSION / VISION ---------------- */
function MissionVision() {
  const cardLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const cardRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="mission" className="relative py-20 sm:py-32 border-t border-border overflow-hidden">
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
              Placing clients at the center of every decision.
            </h3>
            <p className="mt-4 sm:mt-6 text-muted-foreground leading-relaxed max-w-md font-light text-sm sm:text-base">
              To deliver unparalleled real estate experiences by placing our clients at the center of every decision. We are committed to providing expert guidance, fostering transparent communication, and utilizing cutting-edge market strategies to help our clients find, secure, and cherish the places they call home.
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
              Transforming the African property landscape.
            </h3>
            <p className="mt-4 sm:mt-6 text-muted-foreground leading-relaxed max-w-md font-light text-sm sm:text-base">
              To be the most trusted and respected real estate brand, recognized across Africa and globally for transforming the property landscape through exceptional service, innovative solutions, and a dedication to enriching the communities we serve.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="relative py-20 sm:py-32 border-t border-border overflow-hidden bg-background">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } }
        }}
        className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 text-center"
      >
        <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 text-xs tracking-[0.28em] uppercase text-muted-foreground mb-6 sm:mb-8">
          <span className="h-px w-10 bg-gold" /> The Josel Signature
        </motion.div>
        <motion.h2 variants={fadeInUp} className="font-display text-[clamp(2.25rem,9vw,8rem)] leading-[0.9] tracking-[-0.03em]">
          Built on <em className="italic text-gold-gradient not-italic md:italic">trust</em>,
          <br className="hidden md:block" /> styled <em className="italic">for</em> you.
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
          Speak with our concierge team. Private viewings across Accra and the
          Volta Region are available by appointment.
        </motion.p>
        <motion.div variants={fadeInUp} className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="tel:+233244880083"
            className="inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Phone size={14} />
            Call 0244 880 083
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
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name" })
    .max(80, { message: "Name is too long" }),
  email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email address" })
    .max(160, { message: "Email is too long" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message should be at least 10 characters" })
    .max(1000, { message: "Keep it under 1000 characters" }),
});
type ContactValues = z.infer<typeof contactSchema>;
type ContactErrors = Partial<Record<keyof ContactValues, string>>;

function ContactForm() {
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof ContactValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    toast.success("Message received — our concierge will call you shortly.");
    setValues({ name: "", email: "", message: "" });
  };

  const field = (id: keyof ContactValues, label: string, err?: string) => (
    <div>
      <label
        htmlFor={id}
        className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2"
      >
        {label}
      </label>
      {id === "message" ? (
        <textarea
          id={id}
          rows={4}
          value={values[id]}
          onChange={set(id)}
          maxLength={1000}
          className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 text-sm resize-none transition-colors"
          placeholder="Tell us about the residence you're looking for…"
        />
      ) : (
        <input
          id={id}
          type={id === "email" ? "email" : "text"}
          value={values[id]}
          onChange={set(id)}
          maxLength={id === "email" ? 160 : 80}
          className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-3 text-sm transition-colors"
          placeholder={id === "email" ? "you@example.com" : "Your full name"}
        />
      )}
      {err && <p className="mt-2 text-xs text-red-500">{err}</p>}
    </div>
  );

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

      {field("name", "Full name", errors.name)}
      <div className="grid sm:grid-cols-2 gap-6">
        {field("email", "Email", errors.email)}
        <div>
          <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Direct line
          </label>
          <a
            href="tel:+233244880083"
            className="flex items-center gap-2 py-3 text-sm border-b border-border hover:text-gold transition-colors"
          >
            <Phone size={14} className="text-gold" />
            0244 880 083
          </a>
        </div>
      </div>
      {field("message", "Message", errors.message)}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        {submitting ? "Sending…" : "Send enquiry"}
        <Send size={14} />
      </button>
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
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/joselhomes_gh", label: "Instagram" },
  { icon: TiktokIcon, href: "https://tiktok.com/@JOSELHOMES", label: "TikTok" },
];

function SocialsAndLinks() {
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
      </nav>
    </div>
  );
}

function Footer() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
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
          visible: { transition: { staggerChildren: 0.15 } }
        }}
        className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-12 lg:gap-16"
      >
        {/* LEFT: Brand + info */}
        <motion.div variants={fadeInUp} className="space-y-8">
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
            A premium Ghanaian residential house delivering signature homes
            across Accra and the Volta Region since 2020.
          </p>

          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="tel:+233244880083"
                className="inline-flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Phone size={14} className="text-gold" /> 0244 880 083
              </a>
            </li>
            <li>
              <a
                href="mailto:Joselhomes.africa@gmail.com"
                className="inline-flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Mail size={14} className="text-gold" /> Joselhomes.africa@gmail.com
              </a>
            </li>
            <li className="inline-flex items-center gap-3 text-muted-foreground">
              <MapPin size={14} className="text-gold" /> Accra · Volta Region, Ghana
            </li>
          </ul>

          <div className="hidden lg:block">
            <SocialsAndLinks />
          </div>
        </motion.div>

        {/* RIGHT: Form */}
        <motion.div variants={fadeInUp} className="space-y-12">
          <ContactForm />
          <div className="block lg:hidden pt-8 border-t border-border/60">
            <SocialsAndLinks />
          </div>
        </motion.div>
      </motion.div>

      {/* TAGLINE */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
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
        <motion.div variants={fadeInUp} className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] tracking-widest uppercase text-muted-foreground gap-2">
          <span>© {new Date().getFullYear()} Josel Homes. All rights reserved.</span>
          <span>Est. 2020 · Accra, Ghana</span>
        </motion.div>
        {false && (
          <motion.div variants={fadeInUp} className="mt-6 text-center text-[10px] sm:text-xs tracking-widest font-sans font-light text-muted-foreground/40">
            Architecture & Engineering by{" "}
            <a
              href="https://osnwtechstudio.com?ref=joselhomes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-300 underline underline-offset-4 decoration-transparent hover:decoration-gold/60"
            >
              OSNW Tech Studio
            </a>
          </motion.div>
        )}
      </motion.div>
    </footer>
  );
}

/* ---------------- DAY / NIGHT TOGGLE ---------------- */
function DayNightToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="relative flex items-center rounded-full border border-border bg-background/80 backdrop-blur-xl p-1 shadow-2xl">
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full ${
            mode === "day" ? "bg-primary" : "bg-gold"
          }`}
          style={{ left: mode === "day" ? 4 : "calc(50% + 0px)" }}
        />
        {(["day", "night"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative z-10 px-5 sm:px-6 py-2.5 text-[11px] sm:text-xs tracking-[0.25em] uppercase transition-colors ${
              mode === m
                ? m === "day"
                  ? "text-primary-foreground"
                  : "text-navy-deep"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {m === "day" ? "☀ Day" : "☾ Night"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PROPERTY DETAIL OVERLAY MODAL ---------------- */
function PropertyModal({
  property,
  onClose,
}: {
  property: typeof LISTINGS[number];
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Lock scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const slideIndex = Math.abs(page % property.images.length);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setPage((prev) => prev + newDirection);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 md:p-10 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 50, scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-[1100px] bg-background text-foreground rounded-[2rem] border border-border shadow-2xl overflow-hidden grid lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition-colors"
        >
          <X size={20} />
        </button>

        {/* LEFT COLUMN: Gallery Slideshow Carousel (lg:col-span-7) */}
        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:h-[580px] overflow-hidden bg-muted flex items-center justify-center">
          <div className="relative w-full h-full">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={page}
                src={property.images[slideIndex]}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={`${property.name} view`}
              />
            </AnimatePresence>

            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

            {/* Navigation Chevrons */}
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition-colors z-20 cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition-colors z-20 cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>

            {/* Image Counter Badge */}
            <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur px-3.5 py-1.5 rounded-full text-white text-[10px] tracking-widest uppercase">
              {slideIndex + 1} / {property.images.length}
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > slideIndex ? 1 : -1);
                    setPage(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    slideIndex === idx ? "w-5 bg-gold" : "w-1.5 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Property Details (lg:col-span-5) */}
        <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full overflow-y-auto lg:h-[580px]">
          <div className="space-y-6">
            {/* Tag and Price */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <span className="rounded-full bg-gold/15 text-gold text-[10px] tracking-widest uppercase font-semibold px-3.5 py-1.5">
                {property.tag}
              </span>
              <span className="font-display text-2xl font-semibold text-gold-soft">
                {property.price}
              </span>
            </div>

            {/* Title & Region */}
            <div className="space-y-1">
              <h2 className="font-display text-2xl sm:text-3xl tracking-tight leading-none">
                {property.name}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin size={14} className="text-gold" /> {property.region}
              </p>
            </div>

            {/* Interior Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 border-y border-border/60 py-4 text-center">
              <div className="space-y-1">
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-center gap-1">
                  <Bed size={12} className="text-gold" /> Beds
                </div>
                <div className="text-sm font-semibold">{property.beds}</div>
              </div>
              <div className="space-y-1 border-x border-border/40">
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-center gap-1">
                  <Bath size={12} className="text-gold" /> Baths
                </div>
                <div className="text-sm font-semibold">{property.baths}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-center gap-1">
                  <Maximize2 size={12} className="text-gold" /> Area
                </div>
                <div className="text-sm font-semibold">{property.sqft} <span className="text-[10px] text-muted-foreground font-light">sqft</span></div>
              </div>
            </div>

            {/* Description Copy */}
            <div className="space-y-2">
              <h3 className="text-[10px] tracking-widest uppercase text-muted-foreground">Overview</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-6 mt-6 lg:mt-0 border-t border-border/60">
            <a
              href="#contact"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs py-3.5 tracking-widest uppercase font-sans font-semibold border border-border/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Inquire About Residence
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
