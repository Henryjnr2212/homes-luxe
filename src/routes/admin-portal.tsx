import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useCMS, IMAGE_LIST, IMAGE_MAP } from "../lib/cms-context";
import { supabase, type DbInquiry } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  Phone,
  Mail,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ArrowLeft,
  Check,
  RotateCcw,
  LayoutDashboard,
  FileText,
  Contact2,
  Building,
  Save,
  Trash,
  X,
  Sparkles,
  Upload,
  Inbox,
  Loader2,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/admin-portal")({
  component: AdminPortal,
});

function AdminPortal() {
  const {
    data,
    updateContact,
    updateHero,
    updateAbout,
    updateMissionVision,
    addListing,
    editListing,
    deleteListing,
    resetToDefault,
    isAuthenticated,
    login,
    logout,
  } = useCMS();

  const navigate = useNavigate();

  // Custom image uploads state
  const [customImages, setCustomImages] = useState<{ id: string; src: string; label: string }[]>(
    [],
  );
  const [isDragging, setIsDragging] = useState(false);
  // Tracks the raw File object to be uploaded to Supabase Storage on save
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const src = URL.createObjectURL(file);
      const id = `custom-${Date.now()}`;
      const newImg = { id, src, label: file.name };
      setCustomImages((prev) => [...prev, newImg]);
      setListImgId(id);
      IMAGE_MAP[id] = src;
      setPendingImageFile(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    // Only keep the first file as the primary image
    const file = files[0];
    const src = URL.createObjectURL(file);
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    IMAGE_MAP[id] = src;
    const newImg = { id, src, label: file.name };
    setCustomImages((prev) => [...prev, newImg]);
    setListImgId(id);
    // Store raw file so handleSaveListing can upload it
    setPendingImageFile(file);
    e.target.value = "";
  };

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"listings" | "text" | "contact" | "inquiries">(
    "listings",
  );

  // Inquiries state
  const [inquiries, setInquiries] = useState<DbInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesView, setInquiriesView] = useState<"leads" | "clients">("leads");

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    const { data: rows, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setInquiries((rows ?? []) as DbInquiry[]);
    setInquiriesLoading(false);
  };

  const handlePromoteToClient = async (entryId: string) => {
    const promise = supabase
      .from("inquiries")
      .update({ status: "Client" })
      .eq("id", entryId);

    toast.promise(promise, {
      loading: "Promoting lead to client...",
      success: () => {
        setInquiries((prev) =>
          prev.map((i) => (i.id === entryId ? { ...i, status: "Client" } : i))
        );
        return "Lead promoted to client portfolio successfully!";
      },
      error: "Failed to promote lead.",
    });
  };

  const handleDeleteInquiry = async (entryId: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry record? This action cannot be undone.")) {
      return;
    }
    const promise = supabase
      .from("inquiries")
      .delete()
      .eq("id", entryId);

    toast.promise(promise, {
      loading: "Deleting inquiry record...",
      success: () => {
        setInquiries((prev) => prev.filter((i) => i.id !== entryId));
        return "Inquiry record deleted successfully!";
      },
      error: "Failed to delete inquiry.",
    });
  };



  // Fetch inquiries on mount + subscribe to realtime updates
  useEffect(() => {
    void fetchInquiries();
    const channel = supabase
      .channel("inquiries-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, () => {
        void fetchInquiries();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // Listings Form Modal State
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  // Listing form fields
  const [listName, setListName] = useState("");
  const [listRegion, setListRegion] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [listImgId, setListImgId] = useState("prop1");
  const [listBeds, setListBeds] = useState(4);
  const [listBaths, setListBaths] = useState(4.5);
  const [listSqft, setListSqft] = useState("5,000");
  const [listTag, setListTag] = useState("New");
  const [listShape, setListShape] = useState<"arch" | "rounded">("arch");
  const [listDesc, setListDesc] = useState("");

  // Text Content state
  const [heroTag, setHeroTag] = useState(data.hero.tag);
  const [heroTitle1, setHeroTitle1] = useState(data.hero.title1);
  const [heroTitle2, setHeroTitle2] = useState(data.hero.title2);
  const [heroSub, setHeroSub] = useState(data.hero.subtitle);

  const [aboutUsHeading, setAboutUsHeading] = useState(data.about.aboutUsHeading);
  const [aboutUsText1, setAboutUsText1] = useState(data.about.aboutUsText1);
  const [aboutUsText2, setAboutUsText2] = useState(data.about.aboutUsText2);
  const [aboutUsText3, setAboutUsText3] = useState(data.about.aboutUsText3);

  const [ourStoryHeading, setOurStoryHeading] = useState(data.about.ourStoryHeading);
  const [ourStoryText1, setOurStoryText1] = useState(data.about.ourStoryText1);
  const [ourStoryText2, setOurStoryText2] = useState(data.about.ourStoryText2);
  const [ourStoryText3, setOurStoryText3] = useState(data.about.ourStoryText3);

  const [missionHeading, setMissionHeading] = useState(data.missionVision.missionHeading);
  const [missionText, setMissionText] = useState(data.missionVision.missionText);
  const [visionHeading, setVisionHeading] = useState(data.missionVision.visionHeading);
  const [visionText, setVisionText] = useState(data.missionVision.visionText);

  // Contact state
  const [contactPhone, setContactPhone] = useState(data.contact.phone);
  const [contactEmail, setContactEmail] = useState(data.contact.email);

  // Synchronize dynamic text fields when data updates (e.g. on default reset)
  const syncTextFields = (newData: typeof data) => {
    setHeroTag(newData.hero.tag);
    setHeroTitle1(newData.hero.title1);
    setHeroTitle2(newData.hero.title2);
    setHeroSub(newData.hero.subtitle);
    setAboutUsHeading(newData.about.aboutUsHeading);
    setAboutUsText1(newData.about.aboutUsText1);
    setAboutUsText2(newData.about.aboutUsText2);
    setAboutUsText3(newData.about.aboutUsText3);
    setOurStoryHeading(newData.about.ourStoryHeading);
    setOurStoryText1(newData.about.ourStoryText1);
    setOurStoryText2(newData.about.ourStoryText2);
    setOurStoryText3(newData.about.ourStoryText3);
    setMissionHeading(newData.missionVision.missionHeading);
    setMissionText(newData.missionVision.missionText);
    setVisionHeading(newData.missionVision.visionHeading);
    setVisionText(newData.missionVision.visionText);
    setContactPhone(newData.contact.phone);
    setContactEmail(newData.contact.email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    // Try Supabase Auth first; fall back to legacy credential check
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authData?.session) {
      // Supabase auth succeeded
      login(email, password); // sync CMS context session flag
      toast.success("Welcome back, Administrator");
      syncTextFields(data);
    } else if (authError) {
      // Supabase failed — try legacy hardcoded credentials as fallback
      const success = login(email, password);
      if (success) {
        toast.success("Welcome back, Administrator");
        syncTextFields(data);
      } else {
        setLoginError("Invalid email or password. Please try again.");
        toast.error("Authentication failed");
      }
    }
  };

  const handleSaveTextContent = () => {
    updateHero({
      tag: heroTag,
      title1: heroTitle1,
      title2: heroTitle2,
      subtitle: heroSub,
    });
    updateAbout({
      aboutUsHeading,
      aboutUsText1,
      aboutUsText2,
      aboutUsText3,
      ourStoryHeading,
      ourStoryText1,
      ourStoryText2,
      ourStoryText3,
    });
    updateMissionVision({
      missionHeading,
      missionText,
      visionHeading,
      visionText,
    });
    toast.success("Text content saved successfully!");
  };

  const handleSaveContactInfo = () => {
    updateContact({
      phone: contactPhone,
      email: contactEmail,
    });
    toast.success("Contact information updated globally!");
  };

  const handleResetToDefault = () => {
    if (
      confirm(
        "Are you sure you want to restore all original system copy, listings, and contact details? This cannot be undone.",
      )
    ) {
      resetToDefault();
      // Wait a frame for state to update, then sync local inputs
      setTimeout(() => {
        // Read defaults directly from window.localStorage or reload the page for a clean state
        window.location.reload();
      }, 100);
      toast.success("Restored factory default settings.");
    }
  };

  // Open modal to add a new listing
  const handleOpenAddListing = () => {
    setEditingListingId(null);
    setListName("");
    setListRegion("");
    setListPrice("GH₵ ");
    setListImgId("");
    setCustomImages([]);
    setListBeds(4);
    setListBaths(4);
    setListSqft("5,200");
    setListTag("Signature");
    setListShape("arch");
    setListDesc(
      "A premium modern property offering exquisite layout design, private garden spaces, and luxury architectural details.",
    );
    setIsListingModalOpen(true);
  };

  // Open modal to edit listing
  const handleOpenEditListing = (l: (typeof data.listings)[number]) => {
    setEditingListingId(l.id);
    setListName(l.name);
    setListRegion(l.region);
    setListPrice(l.price);
    setListImgId(l.imgUrl);
    // Bind current listing image to custom showcase selector
    const currentImg = {
      id: l.imgUrl,
      src: l.imgUrl,
      label: "Current Image",
    };
    setCustomImages(currentImg.src ? [currentImg] : []);
    setListBeds(l.beds);
    setListBaths(l.baths);
    setListSqft(l.sqft);
    setListTag(l.tag);
    setListShape(l.shape);
    setListDesc(l.description);
    setIsListingModalOpen(true);
  };

  const handleRemoveCustomImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomImages((prev) => prev.filter((img) => img.id !== id));
    if (listImgId === id) {
      setListImgId("");
    }
  };

  // Handle listing submission — upload image file then call CMS context
  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName || !listRegion || !listPrice || (!listImgId && customImages.length === 0)) {
      toast.error("Please fill in all required fields (Name, Location, GHS Price, and Image).");
      return;
    }

    const imageFile = pendingImageFile;
    const resolvedImgUrl = listImgId || "";

    const payload = {
      name: listName,
      region: listRegion,
      price: listPrice,
      imgUrl: resolvedImgUrl,
      imgPath: null as string | null,
      beds: Number(listBeds) || 4,
      baths: Number(listBaths) || 4,
      sqft: listSqft || "5,000",
      tag: listTag || "New",
      shape: listShape,
      description: listDesc,
    };

    try {
      if (editingListingId) {
        await editListing(editingListingId, payload, imageFile);
        toast.success(`Updated listing: ${listName}`);
      } else {
        await addListing(payload, imageFile);
        toast.success(`Added new listing: ${listName}`);
      }
      setIsListingModalOpen(false);
      setPendingImageFile(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed. Please try again.";
      toast.error(msg);
    }
  };

  const handleDeleteListing = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete the listing "${name}"?`)) {
      try {
        await deleteListing(id);
        toast.success(`Deleted listing: ${name}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Delete failed.";
        toast.error(msg);
      }
    }
  };

  // 1. Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0f14] text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-navy/20 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="font-display text-2xl tracking-[0.25em] text-white uppercase">
                JOSEL HOMES
              </span>
            </Link>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-light">
              Secure Administration Access
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#141822]/80 border border-gold/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-2">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@joselhomes.com"
                  className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-gold/60 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-2">
                  Secret Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-gold/60 transition-colors"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 font-light text-center bg-red-950/40 py-2 rounded-md border border-red-900/30">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-linear-to-r from-gold-soft to-gold text-navy-deep font-sans font-bold text-xs uppercase tracking-widest py-4 rounded-lg shadow-lg hover:shadow-gold/10 transition-all cursor-pointer hover:opacity-90 active:scale-[0.98]"
              >
                Verify & Authenticate
              </button>
            </form>

            {/* Helper Credentials Box */}
            <div className="mt-8 pt-6 border-t border-border/20 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">
                Developer Test Credentials
              </span>
              <div className="inline-block bg-[#0d0f14] border border-border/30 rounded-md px-3 py-2 text-left">
                <p className="text-[11px] text-slate-300 font-mono">
                  <span className="text-gold">Email:</span> admin@joselhomes.com
                </p>
                <p className="text-[11px] text-slate-300 font-mono mt-1">
                  <span className="text-gold">Pass:</span> admin123
                </p>
              </div>
            </div>
          </div>

          {/* Cancel button */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Render CMS Dashboard if authenticated
  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 font-sans pb-20">
      <Toaster position="top-center" richColors />

      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 bg-[#0d0f14]/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="text-gold" size={20} />
            <div className="min-w-0">
              <h1 className="font-display text-xl sm:text-2xl tracking-wide text-white uppercase">
                JOSEL CMS
              </h1>
              <p className="text-[9px] tracking-[0.25em] text-muted-foreground uppercase">
                Management Control Centre
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border/60 hover:border-white px-4 py-2 text-xs uppercase tracking-widest transition-all font-medium text-slate-300 hover:text-white"
            >
              <ArrowLeft size={12} /> Live Site
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full bg-red-950/40 hover:bg-red-900/30 border border-red-900/40 px-4 py-2 text-xs uppercase tracking-widest text-red-400 hover:text-red-300 transition-all font-medium cursor-pointer"
            >
              <LogOut size={12} /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 mt-8 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-6">
          <div className="bg-[#141822] rounded-xl border border-border/40 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("listings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                activeTab === "listings"
                  ? "bg-gold text-navy-deep shadow-md"
                  : "hover:bg-[#1f2635] text-slate-300"
              }`}
            >
              <Building size={14} />
              Listings Manager
            </button>

            <button
              onClick={() => setActiveTab("text")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                activeTab === "text"
                  ? "bg-gold text-navy-deep shadow-md"
                  : "hover:bg-[#1f2635] text-slate-300"
              }`}
            >
              <FileText size={14} />
              Page Text Editor
            </button>

            <button
              onClick={() => setActiveTab("contact")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                activeTab === "contact"
                  ? "bg-gold text-navy-deep shadow-md"
                  : "hover:bg-[#1f2635] text-slate-300"
              }`}
            >
              <Contact2 size={14} />
              Contact Controller
            </button>

            <button
              onClick={() => {
                setActiveTab("inquiries");
                void fetchInquiries();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                activeTab === "inquiries"
                  ? "bg-gold text-navy-deep shadow-md"
                  : "hover:bg-[#1f2635] text-slate-300"
              }`}
            >
              <Inbox size={14} />
              Inquiries Ledger
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-[#141822]/40 rounded-xl border border-border/20 p-5 space-y-4">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-gold font-bold">
              System Operations
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Modifying CMS elements immediately updates the global landing layout. Clear cache or
              restore standard fields using the button below.
            </p>
            <button
              onClick={handleResetToDefault}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 border border-border/60 hover:bg-slate-800 text-slate-300 rounded-lg px-4 py-2.5 text-[11px] uppercase tracking-widest transition-all cursor-pointer"
            >
              <RotateCcw size={12} />
              Restore Defaults
            </button>
          </div>
        </aside>

        {/* Modules Display */}
        <section className="bg-[#141822] border border-border/40 rounded-xl p-6 sm:p-8 min-h-[500px]">
          {/* TAB 1: LISTINGS MANAGER */}
          {activeTab === "listings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/30">
                <div>
                  <h2 className="font-display text-2xl text-white tracking-wide">
                    LISTINGS MANAGER
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Create, edit, or delete residences displayed in the scrolling showcase.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddListing}
                  className="inline-flex items-center justify-center gap-2 bg-gold text-navy-deep rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest cursor-pointer hover:opacity-90 transition-all shadow-md"
                >
                  <Plus size={14} /> Add Property
                </button>
              </div>

              {/* Grid of Listings */}
              <div className="grid md:grid-cols-2 gap-4">
                {data.listings.map((l) => (
                  <div
                    key={l.id}
                    className="bg-[#0d0f14] border border-border/30 rounded-xl overflow-hidden flex gap-4 p-3 relative group"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img
                        src={l.imgUrl || IMAGE_MAP["prop1"]}
                        alt={l.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] tracking-widest uppercase bg-gold/10 text-gold px-2 py-0.5 rounded-full font-mono">
                            {l.tag || "Signature"}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {l.sqft} sqft
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white truncate mt-1.5">
                          {l.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground truncate">{l.region}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10">
                        <span className="text-xs font-bold text-gold-soft font-mono">
                          {l.price}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditListing(l)}
                            className="p-1.5 hover:bg-[#1a202c] rounded-md text-slate-300 hover:text-white transition-colors"
                            title="Edit Property"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(l.id, l.name)}
                            className="p-1.5 hover:bg-red-950/30 rounded-md text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {data.listings.length === 0 && (
                <div className="text-center py-16 border border-dashed border-border/20 rounded-xl bg-slate-900/10">
                  <Building className="mx-auto text-muted-foreground/30 mb-3" size={32} />
                  <p className="text-sm text-muted-foreground font-light">
                    No properties found in list database.
                  </p>
                  <button
                    onClick={handleOpenAddListing}
                    className="mt-4 inline-flex items-center justify-center gap-2 border border-border/60 hover:bg-[#1c2230] rounded-full px-4 py-2 text-xs uppercase tracking-widest"
                  >
                    Create First Listing
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEXT CONTENT EDITOR */}
          {activeTab === "text" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-border/30">
                <h2 className="font-display text-2xl text-white tracking-wide">
                  PAGE TEXT CONTENT EDITOR
                </h2>
                <p className="text-xs text-muted-foreground">
                  Update headings, paragraphs, and narratives across home sections.
                </p>
              </div>

              <div className="space-y-8">
                {/* HERO MODULE */}
                <div className="bg-[#0d0f14] p-5 rounded-xl border border-border/20 space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-bold flex items-center gap-2">
                    <Sparkles size={12} /> Landing Hero Section
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                        Location Tag (e.g. Accra · Volta)
                      </label>
                      <input
                        type="text"
                        value={heroTag}
                        onChange={(e) => setHeroTag(e.target.value)}
                        className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                        Hero Main Header Part 1
                      </label>
                      <input
                        type="text"
                        value={heroTitle1}
                        onChange={(e) => setHeroTitle1(e.target.value)}
                        className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Hero Main Header Part 2 (Italicized Gold Accent)
                    </label>
                    <input
                      type="text"
                      value={heroTitle2}
                      onChange={(e) => setHeroTitle2(e.target.value)}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Hero Subheadline Description
                    </label>
                    <textarea
                      value={heroSub}
                      onChange={(e) => setHeroSub(e.target.value)}
                      rows={2}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none"
                    />
                  </div>
                </div>

                {/* ABOUT US MODULE */}
                <div className="bg-[#0d0f14] p-5 rounded-xl border border-border/20 space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
                    About Us Section Copy
                  </h3>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={aboutUsHeading}
                      onChange={(e) => setAboutUsHeading(e.target.value)}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      About Us Description Paragraph 1
                    </label>
                    <textarea
                      value={aboutUsText1}
                      onChange={(e) => setAboutUsText1(e.target.value)}
                      rows={3}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      About Us Description Paragraph 2
                    </label>
                    <textarea
                      value={aboutUsText2}
                      onChange={(e) => setAboutUsText2(e.target.value)}
                      rows={3}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      About Us Description Paragraph 3
                    </label>
                    <textarea
                      value={aboutUsText3}
                      onChange={(e) => setAboutUsText3(e.target.value)}
                      rows={3}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none"
                    />
                  </div>
                </div>

                {/* OUR STORY MODULE */}
                <div className="bg-[#0d0f14] p-5 rounded-xl border border-border/20 space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
                    Our Story / Narrative Section
                  </h3>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Our Story Heading
                    </label>
                    <input
                      type="text"
                      value={ourStoryHeading}
                      onChange={(e) => setOurStoryHeading(e.target.value)}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Our Story Paragraph 1
                    </label>
                    <textarea
                      value={ourStoryText1}
                      onChange={(e) => setOurStoryText1(e.target.value)}
                      rows={3}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Our Story Paragraph 2
                    </label>
                    <textarea
                      value={ourStoryText2}
                      onChange={(e) => setOurStoryText2(e.target.value)}
                      rows={3}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Our Story Paragraph 3
                    </label>
                    <textarea
                      value={ourStoryText3}
                      onChange={(e) => setOurStoryText3(e.target.value)}
                      rows={3}
                      className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none"
                    />
                  </div>
                </div>

                {/* MISSION & VISION */}
                <div className="bg-[#0d0f14] p-5 rounded-xl border border-border/20 space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.25em] text-gold font-bold flex items-center justify-between">
                    <span>Mission & Vision Cards</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Mission Card */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                        — Mission Copy
                      </h4>
                      <div>
                        <label className="block text-[9px] tracking-widest uppercase text-muted-foreground mb-1">
                          Mission Title
                        </label>
                        <input
                          type="text"
                          value={missionHeading}
                          onChange={(e) => setMissionHeading(e.target.value)}
                          className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] tracking-widest uppercase text-muted-foreground mb-1">
                          Mission Narrative
                        </label>
                        <textarea
                          value={missionText}
                          onChange={(e) => setMissionText(e.target.value)}
                          rows={4}
                          className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none"
                        />
                      </div>
                    </div>

                    {/* Vision Card */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                        — Vision Copy
                      </h4>
                      <div>
                        <label className="block text-[9px] tracking-widest uppercase text-muted-foreground mb-1">
                          Vision Title
                        </label>
                        <input
                          type="text"
                          value={visionHeading}
                          onChange={(e) => setVisionHeading(e.target.value)}
                          className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] tracking-widest uppercase text-muted-foreground mb-1">
                          Vision Narrative
                        </label>
                        <textarea
                          value={visionText}
                          onChange={(e) => setVisionText(e.target.value)}
                          rows={4}
                          className="w-full bg-[#141822] border border-border/40 rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveTextContent}
                    className="inline-flex items-center justify-center gap-2 bg-gold text-navy-deep rounded-lg px-6 py-3.5 text-xs font-semibold uppercase tracking-widest cursor-pointer hover:opacity-90 shadow-md transition-all"
                  >
                    <Save size={14} /> Save Text Content
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT INFO CONTROLLER */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-border/30">
                <h2 className="font-display text-2xl text-white tracking-wide">
                  CONTACT INFO CONTROLLER
                </h2>
                <p className="text-xs text-muted-foreground">
                  Instantly change the direct phone line and email address used across header,
                  forms, CTA, and footer.
                </p>
              </div>

              <div className="space-y-6 max-w-xl">
                <div className="bg-[#0d0f14] p-5 rounded-xl border border-border/20 space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                      Global Phone Number
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="0244 880 083"
                      className="w-full bg-[#141822] border border-border/60 rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-gold/60 transition-colors"
                    />
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5 leading-relaxed">
                      Changing this changes all telephone layout text and click-to-dial `tel:`
                      actions instantly.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                      Global Email Address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Joselhomes.africa@gmail.com"
                      className="w-full bg-[#141822] border border-border/60 rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-gold/60 transition-colors"
                    />
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5 leading-relaxed">
                      Changing this updates all email link layout nodes and click-to-email `mailto:`
                      actions.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveContactInfo}
                    className="inline-flex items-center justify-center gap-2 bg-gold text-navy-deep rounded-lg px-6 py-3.5 text-xs font-semibold uppercase tracking-widest cursor-pointer hover:opacity-90 shadow-md transition-all"
                  >
                    <Save size={14} /> Save Contact Info
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* TAB 4: INQUIRIES LEDGER */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/30">
                <div>
                  <h2 className="font-display text-2xl text-white tracking-wide">
                    INQUIRIES LEDGER
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Live inbound leads from the contact form — updates in real-time.
                  </p>
                </div>
                <button
                  onClick={() => void fetchInquiries()}
                  className="inline-flex items-center gap-2 border border-border/60 hover:bg-[#1c2230] rounded-full px-4 py-2 text-xs uppercase tracking-widest text-slate-300 transition-all cursor-pointer"
                >
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              {/* Pipeline View Tabs */}
              <div className="flex border-b border-border/20">
                <button
                  onClick={() => setInquiriesView("leads")}
                  className={`px-4 py-2.5 text-xs font-mono tracking-widest uppercase border-b-2 transition-all cursor-pointer ${
                    inquiriesView === "leads"
                      ? "border-gold text-gold font-semibold"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Active Leads ({inquiries.filter((i) => (i.status || "Lead") === "Lead").length})
                </button>
                <button
                  onClick={() => setInquiriesView("clients")}
                  className={`px-4 py-2.5 text-xs font-mono tracking-widest uppercase border-b-2 transition-all cursor-pointer ${
                    inquiriesView === "clients"
                      ? "border-gold text-gold font-semibold"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Client Directory ({inquiries.filter((i) => i.status === "Client").length})
                </button>
              </div>

              {inquiriesLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-gold" size={28} />
                </div>
              ) : (
                (() => {
                  const filtered = inquiries.filter((inq) => {
                    const status = inq.status || "Lead";
                    return inquiriesView === "leads" ? status === "Lead" : status === "Client";
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-16 border border-dashed border-border/20 rounded-xl bg-slate-900/10">
                        <Inbox className="mx-auto text-muted-foreground/30 mb-3" size={32} />
                        <p className="text-sm text-muted-foreground font-light">
                          {inquiriesView === "leads"
                            ? "No active leads at the moment."
                            : "No clients in the directory yet."}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {inquiriesView === "leads"
                            ? "New messages from the contact form will appear here."
                            : "Promote active leads to add them to your client directory."}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {filtered.map((inq) => {
                        const statusStr = inq.status || "Lead";
                        return (
                          <div
                            key={inq.id}
                            className="bg-[#0d0f14] border border-border/30 rounded-xl p-4 sm:p-5 hover:border-gold/20 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                  <span className="font-semibold text-sm text-white">{inq.name}</span>
                                  <span
                                    className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full font-mono font-medium ${
                                      statusStr === "Client"
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                        : "bg-gold/15 text-gold border border-gold/20"
                                    }`}
                                  >
                                    {statusStr === "Client" ? "Client" : "Lead"}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground mb-3">
                                  <span className="flex items-center gap-1.5">
                                    <Mail size={10} className="text-gold" />
                                    {inq.email}
                                  </span>
                                  {inq.phone && (
                                    <span className="flex items-center gap-1.5">
                                      <Phone size={10} className="text-gold" />
                                      {inq.phone}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-gold/30 pl-3">
                                  {inq.message}
                                </p>
                              </div>
                              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                                <div className="text-left sm:text-right">
                                  <p className="text-[9px] text-muted-foreground/60 font-mono">
                                    {new Date(inq.created_at).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                  <p className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">
                                    {new Date(inq.created_at).toLocaleTimeString("en-GB", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-end">
                                  {statusStr === "Lead" && (
                                    <button
                                      onClick={() => void handlePromoteToClient(inq.id)}
                                      className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/20 hover:bg-gold/20 text-gold hover:text-white rounded-lg px-3 py-1 text-[10px] uppercase tracking-wider font-medium transition-all cursor-pointer"
                                    >
                                      <Check size={10} /> Promote to Client
                                    </button>
                                  )}
                                  <button
                                    onClick={() => void handleDeleteInquiry(inq.id)}
                                    className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-400 hover:text-white rounded-lg px-3 py-1 text-[10px] uppercase tracking-wider font-medium transition-all cursor-pointer"
                                    title="Delete Entry"
                                  >
                                    <Trash2 size={10} /> Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </section>
      </main>

      {/* Listing Form Modal */}
      <AnimatePresence>
        {isListingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141822] border border-gold/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border/30 px-6 py-4 bg-[#0d0f14]">
                <h3 className="font-display text-lg tracking-wide uppercase text-white">
                  {editingListingId ? "Edit Property Listing" : "Add New Property Listing"}
                </h3>
                <button
                  onClick={() => setIsListingModalOpen(false)}
                  className="p-1 hover:bg-[#1a202c] rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form
                onSubmit={handleSaveListing}
                className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      placeholder="e.g. Palm Court Villa"
                      className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Location / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={listRegion}
                      onChange={(e) => setListRegion(e.target.value)}
                      placeholder="e.g. East Legon, Accra"
                      className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      GHS Price *
                    </label>
                    <input
                      type="text"
                      required
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      placeholder="e.g. GH₵ 4.2M"
                      className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Feature Tag
                    </label>
                    <input
                      type="text"
                      value={listTag}
                      onChange={(e) => setListTag(e.target.value)}
                      placeholder="e.g. Signature, Featured, New"
                      className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={listBeds}
                      onChange={(e) => setListBeds(Number(e.target.value))}
                      className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={listBaths}
                      onChange={(e) => setListBaths(Number(e.target.value))}
                      className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Sq Feet
                    </label>
                    <input
                      type="text"
                      value={listSqft}
                      onChange={(e) => setListSqft(e.target.value)}
                      placeholder="e.g. 7,200"
                      className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold/60"
                    />
                  </div>
                </div>

                {/* IMAGE SELECTOR MODULE */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                      Property Showcase Image *
                    </label>
                    {customImages.length === 0 && (
                      <span className="text-[9px] text-muted-foreground/50 italic">
                        No image selected — click + Upload to add one
                      </span>
                    )}
                  </div>
                  {/* Flex-wrap row: Upload tile always first, uploaded thumbnails flow after it */}
                  <div className="flex flex-wrap gap-3">
                    {/* Dashed-Border Drag-and-Drop Upload Tile */}
                    <label
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] shrink-0 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
                        isDragging
                          ? "border-gold bg-gold/8 scale-[1.03]"
                          : "border-border/50 hover:border-gold/70 bg-[#0d0f14]/60 hover:bg-[#0d0f14]"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload
                        size={15}
                        className="text-muted-foreground group-hover:text-gold transition-colors mb-1"
                      />
                      <span className="text-[7px] sm:text-[8px] tracking-widest uppercase text-muted-foreground group-hover:text-gold/80 transition-colors font-semibold text-center leading-tight px-1">
                        + Upload
                      </span>
                    </label>

                    {/* Dynamically appended uploaded image thumbnails */}
                    {customImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setListImgId(img.id)}
                        className={`w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] shrink-0 rounded-xl overflow-hidden border-2 bg-[#0d0f14] relative transition-all cursor-pointer ${
                          listImgId === img.id
                            ? "border-gold shadow-lg shadow-gold/15 scale-105"
                            : "border-border/40 hover:border-gold/40"
                        }`}
                      >
                        <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                        {/* Selected checkmark overlay */}
                        {listImgId === img.id && (
                          <div className="absolute inset-0 bg-gold/10 flex items-center justify-center pointer-events-none">
                            <span className="bg-gold text-navy-deep rounded-full p-[3px] shadow">
                              <Check size={9} strokeWidth={3} />
                            </span>
                          </div>
                        )}
                        {/* Remove X badge — top-right corner */}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveCustomImage(img.id, e)}
                          className="absolute top-1 right-1 w-[18px] h-[18px] bg-black/70 hover:bg-red-600 border border-white/10 text-white rounded-full flex items-center justify-center shadow-md transition-colors z-20 cursor-pointer"
                          aria-label="Remove image"
                        >
                          <X size={9} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                      Card Border Shape
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setListShape("arch")}
                        className={`px-3 py-2 text-xs uppercase tracking-wider rounded-md border text-center transition-all cursor-pointer ${
                          listShape === "arch"
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border/60 hover:bg-[#1a202c] text-slate-300"
                        }`}
                      >
                        Arch (Classic)
                      </button>
                      <button
                        type="button"
                        onClick={() => setListShape("rounded")}
                        className={`px-3 py-2 text-xs uppercase tracking-wider rounded-md border text-center transition-all cursor-pointer ${
                          listShape === "rounded"
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border/60 hover:bg-[#1a202c] text-slate-300"
                        }`}
                      >
                        Rounded (Modern)
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
                    Property Detail Description
                  </label>
                  <textarea
                    value={listDesc}
                    onChange={(e) => setListDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0d0f14] border border-border/60 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold/60 resize-none animate-none"
                    placeholder="Provide a comprehensive narrative about this premium property..."
                  />
                </div>

                {/* Submit Action buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
                  <button
                    type="button"
                    onClick={() => setIsListingModalOpen(false)}
                    className="border border-border/60 hover:bg-[#1c2230] rounded-lg px-5 py-2.5 text-xs uppercase tracking-widest text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gold text-navy-deep rounded-lg px-6 py-2.5 text-xs font-semibold uppercase tracking-widest cursor-pointer hover:opacity-90"
                  >
                    {editingListingId ? "Save Changes" : "Create Listing"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
