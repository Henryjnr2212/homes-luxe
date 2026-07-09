import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCMS } from "../lib/cms-context";
import { PropertyModal, type ResolvedListing } from "../lib/property-modal";
import { Toaster } from "sonner";
import { ArrowLeft, Bed, Bath, Maximize2, MapPin, SlidersHorizontal, X } from "lucide-react";
import prop1 from "@/assets/prop-1.jpg";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/listings")({
  component: ListingsCatalog,
});

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function ListingsCatalog() {
  const { data } = useCMS();
  const [selectedProperty, setSelectedProperty] = useState<ResolvedListing | null>(null);
  const [activeTag, setActiveTag] = useState<string>("All");
  const [activeRegion, setActiveRegion] = useState<string>("All");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const mappedListings: ResolvedListing[] = data.listings.map((l) => ({
    ...l,
    img: l.imgUrl || prop1,
    images: [l.imgUrl || prop1],
  }));

  // Derive unique filter values
  const tags = useMemo(
    () => ["All", ...Array.from(new Set(mappedListings.map((l) => l.tag).filter(Boolean)))],
    [mappedListings]
  );
  const regions = useMemo(
    () => ["All", ...Array.from(new Set(mappedListings.map((l) => l.region).filter(Boolean)))],
    [mappedListings]
  );

  const filtered = useMemo(
    () =>
      mappedListings.filter((l) => {
        const tagMatch = activeTag === "All" || l.tag === activeTag;
        const regionMatch = activeRegion === "All" || l.region === activeRegion;
        return tagMatch && regionMatch;
      }),
    [mappedListings, activeTag, activeRegion]
  );

  const hasActiveFilter = activeTag !== "All" || activeRegion !== "All";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 hover:border-white/60 px-4 py-2 text-[10px] uppercase tracking-widest transition-all font-medium text-slate-400 hover:text-white"
          >
            <ArrowLeft size={12} /> Home
          </Link>

          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Josel Homes" className="h-9 w-9 object-contain" />
            <span className="hidden sm:block font-sans text-[10px] tracking-[0.3em] font-light uppercase text-foreground/70 group-hover:text-foreground transition-colors">
              JOSEL HOMES
            </span>
          </Link>

          <Link
            to="/"
            hash="contact"
            className="inline-flex items-center gap-2 rounded-full bg-gold hover:bg-gold-soft text-navy-deep text-[10px] sm:text-xs px-4 py-2 transition-colors tracking-widest uppercase font-sans font-bold"
          >
            Enquire
          </Link>
        </div>
      </header>

      {/* ── HERO BAR ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 pt-12 pb-8 sm:pt-16 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-gold font-sans font-medium">
            <span className="h-px w-8 bg-gold/50" />
            Current Collection
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1] tracking-tight font-medium">
            Full{" "}
            <em className="italic text-gold-gradient not-italic font-medium">Showroom</em>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light max-w-xl leading-relaxed pt-1">
            {filtered.length === mappedListings.length
              ? `${mappedListings.length} signature residences across Accra and the Volta Region.`
              : `Showing ${filtered.length} of ${mappedListings.length} residences.`}
          </p>
        </motion.div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 sm:items-center"
        >
          {/* Tag filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] tracking-widest uppercase text-muted-foreground font-sans mr-1">
              Type:
            </span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest font-sans font-semibold transition-all duration-200 border cursor-pointer ${
                  activeTag === tag
                    ? "bg-gold text-navy-deep border-gold shadow-sm"
                    : "bg-transparent border-border/60 text-muted-foreground hover:border-gold/60 hover:text-gold"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="hidden sm:block h-4 w-px bg-border/40" />

          {/* Region filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] tracking-widest uppercase text-muted-foreground font-sans mr-1">
              Region:
            </span>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest font-sans font-semibold transition-all duration-200 border cursor-pointer ${
                  activeRegion === region
                    ? "bg-gold text-navy-deep border-gold shadow-sm"
                    : "bg-transparent border-border/60 text-muted-foreground hover:border-gold/60 hover:text-gold"
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Clear filters */}
          {hasActiveFilter && (
            <button
              onClick={() => {
                setActiveTag("All");
                setActiveRegion("All");
              }}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors cursor-pointer ml-auto"
            >
              <X size={11} /> Clear filters
            </button>
          )}
        </motion.div>
      </section>

      {/* ── GRID ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 pb-24">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center gap-4"
            >
              <SlidersHorizontal size={36} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No residences match the selected filters.
              </p>
              <button
                onClick={() => {
                  setActiveTag("All");
                  setActiveRegion("All");
                }}
                className="text-xs text-gold hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filtered.map((listing, i) => (
                <CatalogCard
                  key={listing.id}
                  listing={listing}
                  index={i}
                  onSelect={() => setSelectedProperty(listing)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── PROPERTY MODAL ── */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            inquireHref="/#contact"
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function CatalogCard({
  listing,
  index,
  onSelect,
}: {
  listing: ResolvedListing;
  index: number;
  onSelect: () => void;
}) {
  const isArch = listing.shape === "arch";

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      onClick={onSelect}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/40 bg-card/30 hover:border-gold/30 transition-all duration-500 hover:shadow-2xl hover:shadow-black/30"
    >
      {/* Image */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-muted"
        style={{
          borderRadius: isArch ? "50% 50% 0 0 / 12% 12% 0 0" : "0.75rem 0.75rem 0 0",
        }}
      >
        <motion.img
          src={listing.img}
          alt={listing.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="rounded-full bg-background/80 backdrop-blur text-foreground text-[9px] tracking-widest uppercase px-3 py-1.5 font-sans font-medium">
            {listing.tag}
          </span>
          <span className="rounded-full bg-gold text-navy-deep text-[9px] tracking-widest uppercase px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans font-semibold">
            View →
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Location + Price row */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[9px] tracking-widest uppercase text-gold font-sans font-medium">
              <MapPin size={9} /> {listing.region}
            </div>
            <h2 className="font-display text-xl leading-tight">{listing.name}</h2>
          </div>
          <span className="font-display text-base font-semibold text-gold-soft whitespace-nowrap">
            {listing.price}
          </span>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-muted-foreground border-t border-border/40 pt-4">
          <span className="flex items-center gap-1.5">
            <Bed size={12} className="text-gold" /> {listing.beds} Beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={12} className="text-gold" /> {listing.baths} Baths
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize2 size={12} className="text-gold" /> {listing.sqft} sqft
          </span>
        </div>

        {/* Description snippet */}
        {listing.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-light">
            {listing.description}
          </p>
        )}

        {/* CTA row */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-sans font-semibold text-foreground/50 group-hover:text-gold transition-colors duration-300">
            View Details <ArrowLeft size={10} className="rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
