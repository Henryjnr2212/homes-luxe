const fs = require("fs");

const filePath = "/Users/henry/Downloads/homes-luxe-main/src/routes/index.tsx";
let content = fs.readFileSync(filePath, "utf8");

function replaceBetween(contentStr, startMarker, endMarker, replacement) {
  const startIndex = contentStr.indexOf(startMarker);
  if (startIndex === -1) {
    throw new Error(`Start marker not found: ${startMarker}`);
  }
  const endIndex = contentStr.indexOf(endMarker, startIndex + startMarker.length);
  if (endIndex === -1) {
    throw new Error(`End marker not found: ${endMarker}`);
  }
  return contentStr.substring(0, startIndex) + replacement + contentStr.substring(endIndex);
}

// 1. Imports & type definition
const importsTarget = `import { createFileRoute } from "@tanstack/react-router";\nimport { useEffect, useState, useRef, useLayoutEffect } from "react";`;
const importsReplacement = `import { createFileRoute, useNavigate } from "@tanstack/react-router";\nimport { useEffect, useState, useRef, useLayoutEffect } from "react";\nimport { useCMS, IMAGE_MAP, Listing } from "../lib/cms-context";\n\nexport type ResolvedListing = Listing & {\n  img: string;\n  images: string[];\n};`;
if (!content.includes(importsTarget)) {
  throw new Error("Imports target not found");
}
content = content.replace(importsTarget, importsReplacement);

// 2. Landing & Listings
content = replaceBetween(
  content,
  `const LISTINGS = [`,
  `/* ---------------- NAV ---------------- */`,
  `function Landing() {
  const [mode, setMode] = useState<Mode>("day");
  const { data } = useCMS();
  const [selectedProperty, setSelectedProperty] = useState<ResolvedListing | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle("night", mode === "night");
  }, [mode]);

  const mappedListings: ResolvedListing[] = data.listings.map((l) => {
    const imageIds = ["prop1", "prop2", "prop3", "prop4", "prop5", "prop6"];
    const currentIndex = imageIds.indexOf(l.imgId);
    const resolvedImages = [
      IMAGE_MAP[l.imgId] || prop1,
      IMAGE_MAP[imageIds[(currentIndex + 1) % 6]] || prop2,
      IMAGE_MAP[imageIds[(currentIndex + 2) % 6]] || prop3,
      IMAGE_MAP[imageIds[(currentIndex + 3) % 6]] || prop4,
    ];
    return {
      ...l,
      img: IMAGE_MAP[l.imgId] || prop1,
      images: resolvedImages,
    };
  });

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <Nav mode={mode} />
      <Hero mode={mode} setMode={setMode} reduce={!!reduce} />
      <Gallery listings={mappedListings} onSelectProperty={setSelectedProperty} />
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

`,
);

// 3. Nav
content = replaceBetween(
  content,
  `function Nav({ mode }: { mode: Mode }) {`,
  `/* ---------------- HERO ---------------- */`,
  `function Nav({ mode }: { mode: Mode }) {
  const [open, setOpen] = useState(false);
  const { data } = useCMS();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const cleanPhone = data.contact.phone.replace(/\\s+/g, "");

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
                href={\`#\${l.toLowerCase()}\`}
                className="text-foreground/60 hover:text-foreground transition-all duration-300"
              >
                {l}
              </a>
            ))}
          </nav>

          {/* CTA + HAMBURGER */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={\`tel:\${cleanPhone}\`}
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
              {NAV_LINKS.map((l) => (
                <a
                  key={l}
                  href={\`#\${l.toLowerCase()}\`}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl py-5 flex items-center justify-between hover:text-gold transition-colors"
                >
                  {l}
                  <ArrowRight size={22} className="opacity-40" />
                </a>
              ))}
            </motion.nav>
            <a
              href={\`tel:\${cleanPhone}\`}
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

`,
);

// 4. Hero
// Exact string replace for useCMS hook addition
const heroStartTarget = `function Hero({
  mode,
  setMode,
  reduce,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  reduce: boolean;
}) {
  const containerVariants = {`;
const heroStartReplacement = `function Hero({
  mode,
  setMode,
  reduce,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  reduce: boolean;
}) {
  const { data } = useCMS();
  const containerVariants = {`;
if (!content.includes(heroStartTarget)) {
  throw new Error("Hero start target not found");
}
content = content.replace(heroStartTarget, heroStartReplacement);

// Exact string replace for soft tag, headline, subheadline
const heroTextTarget = `          {/* Soft tag - slides down */}
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
          </motion.p>`;

const heroTextReplacement = `          {/* Soft tag - slides down */}
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
            <motion.span variants={itemRight} className="block italic font-normal text-gold-gradient">
              {data.hero.title2}
            </motion.span>
          </h1>

          {/* Subheadline - slides up */}
          <motion.p
            variants={itemBottom}
            className="mt-6 sm:mt-8 max-w-2xl text-center text-sm sm:text-base md:text-lg text-slate-100 font-sans font-light leading-relaxed"
          >
            {data.hero.subtitle}
          </motion.p>`;

if (!content.includes(heroTextTarget)) {
  throw new Error("Hero text target not found");
}
content = content.replace(heroTextTarget, heroTextReplacement);

// 5. Gallery
content = replaceBetween(
  content,
  `function Gallery({`,
  `function PropertyCard({`,
  `function Gallery({
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
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
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
            <PropertyCard
              key={i}
              {...l}
              idx={i}
              onSelect={() => onSelectProperty(l)}
            />
          ))}
        </motion.div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 mt-10 sm:mt-12 flex justify-between items-center text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground">
        <span>{listings.length} live listings</span>
        <a
          href="#contact"
          className="text-foreground border-b border-foreground/40 pb-1 hover:border-foreground"
        >
          Inquire now
        </a>
      </div>
    </section>
  );
}

`,
);

// 6. PropertyCard
content = replaceBetween(
  content,
  `function PropertyCard({`,
  `/* ---------------- STORY & HERITAGE ---------------- */`,
  `function PropertyCard({
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
  const heights = ["h-[380px] sm:h-[480px]", "h-[420px] sm:h-[560px]", "h-[360px] sm:h-[440px]", "h-[400px] sm:h-[520px]"];
  const widths = ["w-[240px] sm:w-[320px]", "w-[280px] sm:w-[380px]", "w-[260px] sm:w-[340px]"];
  const h = heights[idx % heights.length];
  const w = widths[idx % widths.length];
  const offset = idx % 2 === 0 ? "translate-y-0" : "translate-y-4 sm:translate-y-8";

  return (
    <motion.div
      onClick={onSelect}
      whileHover="hover"
      className={\`group relative shrink-0 \${w} \${h} \${offset} block text-left cursor-pointer focus:outline-none\`}
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

`,
);

// 7. Story
content = replaceBetween(
  content,
  `function Story() {`,
  `function MissionVision() {`,
  `function Story() {
  const { data } = useCMS();
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const imageReveal = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  return (
    <section id="story" className="relative py-20 sm:py-32 border-t border-border overflow-hidden bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 space-y-24 sm:space-y-36">
        
        {/* PART 1: ABOUT US */}
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
            
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-tight text-foreground font-medium">
              {data.about.aboutUsHeading}
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="space-y-4 text-base sm:text-lg leading-relaxed text-muted-foreground font-light">
              <p className="text-foreground font-medium">
                {data.about.aboutUsText1}
              </p>
              <p>
                {data.about.aboutUsText2}
              </p>
              <p>
                {data.about.aboutUsText3}
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
              {data.about.ourStoryHeading}
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="space-y-4 text-base sm:text-lg leading-relaxed text-muted-foreground font-light">
              <p className="text-foreground font-medium">
                {data.about.ourStoryText1}
              </p>
              <p>
                {data.about.ourStoryText2}
              </p>
              <p>
                {data.about.ourStoryText3}
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

`,
);

// 8. MissionVision
content = replaceBetween(
  content,
  `function MissionVision() {`,
  `function CTA() {`,
  `function MissionVision() {
  const { data } = useCMS();
  const cardLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const cardRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }
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

`,
);

// 9. CTA - boundary replacement ending at `/* ---------------- CONTACT FORM ---------------- */`
content = replaceBetween(
  content,
  `function CTA() {`,
  `/* ---------------- CONTACT FORM ---------------- */`,
  `function CTA() {
  const { data } = useCMS();
  const cleanPhone = data.contact.phone.replace(/\\s+/g, "");
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
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
            href={\`tel:\${cleanPhone}\`}
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

`,
);

// 10. ContactForm imports & link
const contactFormTarget1 = `function ContactForm() {
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);`;
const contactFormReplacement1 = `function ContactForm() {
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { data } = useCMS();`;
if (!content.includes(contactFormTarget1)) {
  throw new Error("ContactForm target 1 not found");
}
content = content.replace(contactFormTarget1, contactFormReplacement1);

const contactFormTarget2 = `          <a
            href="tel:+233244880083"
            className="flex items-center gap-2 py-3 text-sm border-b border-border hover:text-gold transition-colors"
          >
            <Phone size={14} className="text-gold" />
            0244 880 083
          </a>`;
const contactFormReplacement2 = `          <a
            href={\`tel:\${data.contact.phone.replace(/\\s+/g, "")}\`}
            className="flex items-center gap-2 py-3 text-sm border-b border-border hover:text-gold transition-colors"
          >
            <Phone size={14} className="text-gold" />
            {data.contact.phone}
          </a>`;
if (!content.includes(contactFormTarget2)) {
  throw new Error("ContactForm target 2 not found");
}
content = content.replace(contactFormTarget2, contactFormReplacement2);

// 11. Footer
content = replaceBetween(
  content,
  `function Footer() {`,
  `/* ---------------- DAY / NIGHT TOGGLE ---------------- */`,
  `function Footer() {
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

  const cleanPhone = data.contact.phone.replace(/\\s+/g, "");

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
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
          {/* Circular click/tap target container wrapper */}
          <div
            onClick={handleTripleClickOrTap}
            className="select-none space-y-8 cursor-default"
          >
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
          </div>

          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={\`tel:\${cleanPhone}\`}
                className="inline-flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Phone size={14} className="text-gold" /> {data.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={\`mailto:\${data.contact.email}\`}
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
        viewport={{ once: true, margin: "-100px" }}
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
      </motion.div>
    </footer>
  );
}

`,
);

// 12. PropertyModal type signature
const modalTarget = `function PropertyModal({
  property,
  onClose,
}: {
  property: typeof LISTINGS[number];
  onClose: () => void;
}) {`;
const modalReplacement = `function PropertyModal({
  property,
  onClose,
}: {
  property: ResolvedListing;
  onClose: () => void;
}) {`;
if (!content.includes(modalTarget)) {
  throw new Error("PropertyModal target not found");
}
content = content.replace(modalTarget, modalReplacement);

// 13. Replace all "as any" type-casts with Prettier/ESLint clean "as const" typeassertions
content = content.replace(/as any/g, "as const");

// 14. Global Spring transition casting to bypass TS generic inference error
content = content.replace(/type: "spring"/g, 'type: "spring" as const');

fs.writeFileSync(filePath, content, "utf8");
console.log("All replacements completed successfully!");
