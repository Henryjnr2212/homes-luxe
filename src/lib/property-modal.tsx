import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Listing } from "./cms-context";
import { X, ChevronLeft, ChevronRight, Bed, Bath, Maximize2, MapPin } from "lucide-react";

export type ResolvedListing = Listing & {
  img: string;
  images: string[];
};

export function PropertyModal({
  property,
  onClose,
  inquireHref = "#contact",
}: {
  property: ResolvedListing;
  onClose: () => void;
  /** Where the "Inquire" CTA should link. Defaults to "#contact". */
  inquireHref?: string;
}) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

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

  const slideIndex = Math.abs(page % property.images.length);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setPage((prev) => prev + newDirection);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0 }),
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
        transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
        className="relative w-full max-w-[1100px] bg-background text-foreground rounded-[2rem] border border-border shadow-2xl overflow-hidden grid lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* LEFT: Gallery Slideshow */}
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
                  x: { type: "spring" as const, stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={`${property.name} view`}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

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

            <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur px-3.5 py-1.5 rounded-full text-white text-[10px] tracking-widest uppercase">
              {slideIndex + 1} / {property.images.length}
            </div>

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

        {/* RIGHT: Property Details */}
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

            {/* Interior Metrics */}
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
                <div className="text-sm font-semibold">
                  {property.sqft}{" "}
                  <span className="text-[10px] text-muted-foreground font-light">sqft</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-[10px] tracking-widest uppercase text-muted-foreground">
                Overview
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-6 mt-6 lg:mt-0 border-t border-border/60">
            <a
              href={inquireHref}
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
