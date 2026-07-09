import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import prop4 from "@/assets/prop-4.jpg";
import prop5 from "@/assets/prop-5.jpg";
import prop6 from "@/assets/prop-6.jpg";
import { supabase, type DbListing } from "./supabase";

export const IMAGE_MAP: Record<string, string> = { prop1, prop2, prop3, prop4, prop5, prop6 };

export const IMAGE_LIST = [
  { id: "prop1", src: prop1, label: "Modern Villa Front" },
  { id: "prop2", src: prop2, label: "Skyline View Penthouse" },
  { id: "prop3", src: prop3, label: "Volta Lakehouse Scenic" },
  { id: "prop4", src: prop4, label: "Cantonments Courtyard" },
  { id: "prop5", src: prop5, label: "Noir Residence Interior" },
  { id: "prop6", src: prop6, label: "Aburi Hills Estate" },
];

export interface Listing {
  id: string;
  name: string;
  region: string;
  price: string;
  imgUrl: string;
  imgPath: string | null;
  beds: number;
  baths: number;
  sqft: string;
  description: string;
  tag: string;
  shape: "arch" | "rounded";
}

export interface CMSData {
  contact: { phone: string; email: string };
  hero: { tag: string; title1: string; title2: string; subtitle: string };
  about: {
    aboutUsHeading: string;
    aboutUsText1: string;
    aboutUsText2: string;
    aboutUsText3: string;
    ourStoryHeading: string;
    ourStoryText1: string;
    ourStoryText2: string;
    ourStoryText3: string;
  };
  missionVision: {
    missionHeading: string;
    missionText: string;
    visionHeading: string;
    visionText: string;
  };
  listings: Listing[];
}

const DEFAULT_DATA: CMSData = {
  contact: { phone: "0244 880 083", email: "Joselhomes.africa@gmail.com" },
  hero: {
    tag: "Accra · Volta Region",
    title1: "More Than Just Property",
    title2: "it's Your Foundation.",
    subtitle:
      "A premier real estate firm serving Accra and the Volta region, delivering a high-touch, tailored experience.",
  },
  about: {
    aboutUsHeading: "More Than Just Property — it's Your Foundation.",
    aboutUsText1:
      "At JOSEL HOMES, we believe that a home is more than bricks and mortar — it is the foundation of your life's greatest moments, a sanctuary of comfort, and a cornerstone of lasting wealth.",
    aboutUsText2:
      "Founded on the principles of integrity, refined service, and deep market expertise, JOSEL HOMES is a premier real estate firm dedicated to guiding clients seamlessly through their property journeys.",
    aboutUsText3:
      "Whether you are securing your first home, upgrading to a luxury estate, or expanding an investment portfolio, we deliver a high-touch, tailored experience.",
    ourStoryHeading: "Our Story: Redefining Real Estate",
    ourStoryText1:
      "Established in 2020, JOSEL HOMES was born from a vision to bridge the gap between corporate professionalism and genuine, relationship-driven service.",
    ourStoryText2:
      "Starting as a boutique team of property experts serving Accra and the Volta region, our goal was simple: to redefine the property transition experience.",
    ourStoryText3:
      "Today, we stand as a forward-thinking firm that honors its roots while constantly innovating to shape the future of real estate in Africa.",
  },
  missionVision: {
    missionHeading: "Placing clients at the center of every decision.",
    missionText:
      "To deliver unparalleled real estate experiences by placing our clients at the center of every decision.",
    visionHeading: "Transforming the African property landscape.",
    visionText:
      "To be the most trusted and respected real estate brand, recognized across Africa and globally for transforming the property landscape.",
  },
  listings: [],
};

function dbRowToListing(row: DbListing): Listing {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    price: row.price,
    imgUrl: row.img_url,
    imgPath: row.img_path,
    beds: Number(row.beds),
    baths: Number(row.baths),
    sqft: row.sqft,
    description: row.description,
    tag: row.tag,
    shape: row.shape,
  };
}

interface CMSContextProps {
  data: CMSData;
  listingsLoading: boolean;
  updateContact: (contact: CMSData["contact"]) => void;
  updateHero: (hero: CMSData["hero"]) => void;
  updateAbout: (about: CMSData["about"]) => void;
  updateMissionVision: (mv: CMSData["missionVision"]) => void;
  addListing: (listing: Omit<Listing, "id">, imageFile: File | null) => Promise<void>;
  editListing: (id: string, listing: Partial<Listing>, imageFile: File | null) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  resetToDefault: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const CMSContext = createContext<CMSContextProps | undefined>(undefined);
const LOCAL_STORAGE_KEY = "homes_luxe_cms_data";
const AUTH_SESSION_KEY = "admin_authenticated";
const STORAGE_BUCKET = "property-images";

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CMSData>(DEFAULT_DATA);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [listingsLoading, setListingsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = window.sessionStorage.getItem(AUTH_SESSION_KEY);
      if (auth === "true") setIsAuthenticated(true);
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<CMSData>;
          if (parsed?.contact && parsed?.hero) {
            setData((prev) => ({
              ...prev,
              contact: parsed.contact ?? prev.contact,
              hero: parsed.hero ?? prev.hero,
              about: parsed.about ?? prev.about,
              missionVision: parsed.missionVision ?? prev.missionVision,
            }));
          }
        } catch {
          /* ignore */
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      const { listings: _unused, ...textFields } = data;
      void _unused;
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(textFields));
    }
  }, [data, isLoaded]);

  const fetchListings = useCallback(async () => {
    setListingsLoading(true);
    let { data: rows, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("[CMS] Fetch listings:", error.message);
      setListingsLoading(false);
      return;
    }

    if (!rows || rows.length === 0) {
      console.log("[CMS] Database is empty. Seeding default listings with images...");
      try {
        const defaultListings = [
          {
            name: "Palm Court Villa",
            region: "East Legon, Accra",
            price: "GH₵ 4.2M",
            imgKey: "prop1",
            beds: 5,
            baths: 6,
            sqft: "7,200",
            tag: "Signature",
            shape: "arch" as const,
            description: "A breathtaking contemporary masterwork situated in the heart of East Legon. Featuring expansive double-height ceilings, a private infinity pool, custom Italian kitchen cabinetry, and panoramic views of manicured palms."
          },
          {
            name: "Skyline Penthouse",
            region: "Airport Residential",
            price: "GH₵ 6.8M",
            imgKey: "prop2",
            beds: 3,
            baths: 3.5,
            sqft: "4,500",
            tag: "Featured",
            shape: "rounded" as const,
            description: "An ultra-premium duplex penthouse scaling the Accra skyline. Completed with floor-to-ceiling glass walls, wrap-around terraces, smart-home automation, and a direct private elevator lobby."
          },
          {
            name: "Volta Lakehouse",
            region: "Akosombo, Volta",
            price: "GH₵ 5.1M",
            imgKey: "prop3",
            beds: 4,
            baths: 4.5,
            sqft: "6,100",
            tag: "New",
            shape: "arch" as const,
            description: "A serene architectural retreat perched on the banks of the Volta Lake in Akosombo. Designed for indoor-outdoor living, with a private jetty, panoramic waterfront glazing, and infinity-edge plunge pool."
          },
          {
            name: "The Cantonments House",
            region: "Cantonments, Accra",
            price: "GH₵ 3.4M",
            imgKey: "prop4",
            beds: 4,
            baths: 4,
            sqft: "5,200",
            tag: "Signature",
            shape: "rounded" as const,
            description: "A secure, editorial-standard modern residence in Accra's premier enclave. Boasting minimalist architectural lines, a hidden garden courtyard, premium oak flooring, and high-security integrations."
          },
          {
            name: "Noir Suite Residence",
            region: "Ridge, Accra",
            price: "GH₵ 2.9M",
            imgKey: "prop5",
            beds: 2,
            baths: 2.5,
            sqft: "3,100",
            tag: "Interior",
            shape: "arch" as const,
            description: "A sophisticated dark-themed residence capturing urban refinement. Features premium textured marble walls, bespoke brass accents, integrated sub-zero appliances, and a secluded private master garden suite."
          },
          {
            name: "Aburi Grand Estate",
            region: "Aburi Hills",
            price: "GH₵ 7.5M",
            imgKey: "prop6",
            beds: 6,
            baths: 7.5,
            sqft: "11,800",
            tag: "Estate",
            shape: "rounded" as const,
            description: "A majestic hillside estate offering sweeping views of Greater Accra from Aburi Hills. Encompasses expansive formal reception halls, a private tennis court, detached guest cottages, and classical architectural scaling."
          }
        ];

        const seededRows: any[] = [];

        for (const item of defaultListings) {
          try {
            const assetUrl = IMAGE_MAP[item.imgKey];
            if (!assetUrl) {
              console.warn(`[CMS] Asset url not found for key: ${item.imgKey}`);
              continue;
            }

            // Fetch image file as Blob
            const res = await fetch(assetUrl);
            const blob = await res.blob();
            const file = new File([blob], `${item.imgKey}.jpg`, { type: "image/jpeg" });

            // Upload to Supabase Storage
            const ext = "jpg";
            const imgPath = `listings/seed-${item.imgKey}-${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage
              .from(STORAGE_BUCKET)
              .upload(imgPath, file, { contentType: "image/jpeg", upsert: true });

            if (uploadError) {
              console.error(`[CMS] Failed to upload seed image for ${item.name}:`, uploadError.message);
              continue;
            }

            const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imgPath);
            const imgUrl = urlData.publicUrl;

            seededRows.push({
              name: item.name,
              region: item.region,
              price: item.price,
              img_url: imgUrl,
              img_path: imgPath,
              beds: item.beds,
              baths: item.baths,
              sqft: item.sqft,
              tag: item.tag,
              shape: item.shape,
              description: item.description,
            });
          } catch (err) {
            console.error(`[CMS] Error preparing seed for ${item.name}:`, err);
          }
        }

        if (seededRows.length > 0) {
          const { data: inserted, error: insertError } = await supabase
            .from("listings")
            .insert(seededRows)
            .select();

          if (insertError) {
            console.error("[CMS] Database seeding insert failed:", insertError.message);
          } else if (inserted) {
            console.log("[CMS] Seeding default listings successful.");
            rows = inserted;
          }
        }
      } catch (err) {
        console.error("[CMS] Error during seeding routine:", err);
      }
    }

    setData((prev) => ({ ...prev, listings: (rows as DbListing[]).map(dbRowToListing) }));
    setListingsLoading(false);
  }, []);

  useEffect(() => {
    void fetchListings();
  }, [fetchListings]);

  const updateContact = (contact: CMSData["contact"]) => setData((p) => ({ ...p, contact }));
  const updateHero = (hero: CMSData["hero"]) => setData((p) => ({ ...p, hero }));
  const updateAbout = (about: CMSData["about"]) => setData((p) => ({ ...p, about }));
  const updateMissionVision = (missionVision: CMSData["missionVision"]) =>
    setData((p) => ({ ...p, missionVision }));

  const uploadImage = async (file: File): Promise<{ imgUrl: string; imgPath: string } | null> => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const imgPath = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(imgPath, file, { contentType: file.type, upsert: false });
    if (error) {
      console.error("[CMS] Upload failed:", error.message);
      return null;
    }
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imgPath);
    return { imgUrl: urlData.publicUrl, imgPath };
  };

  const addListing = async (newListing: Omit<Listing, "id">, imageFile: File | null) => {
    let imgUrl = newListing.imgUrl;
    let imgPath = newListing.imgPath ?? null;
    if (imageFile) {
      const up = await uploadImage(imageFile);
      if (up) {
        imgUrl = up.imgUrl;
        imgPath = up.imgPath;
      }
    }
    const { error } = await supabase.from("listings").insert({
      name: newListing.name,
      region: newListing.region,
      price: newListing.price,
      img_url: imgUrl,
      img_path: imgPath,
      beds: newListing.beds,
      baths: newListing.baths,
      sqft: newListing.sqft,
      tag: newListing.tag,
      shape: newListing.shape,
      description: newListing.description,
    });
    if (error) {
      console.error("[CMS] Insert:", error.message);
      throw new Error(error.message);
    }
    await fetchListings();
  };

  const editListing = async (
    id: string,
    updatedFields: Partial<Listing>,
    imageFile: File | null,
  ) => {
    let imgUrl = updatedFields.imgUrl;
    let imgPath = updatedFields.imgPath ?? null;
    if (imageFile) {
      const up = await uploadImage(imageFile);
      if (up) {
        imgUrl = up.imgUrl;
        imgPath = up.imgPath;
        const current = data.listings.find((l) => l.id === id);
        if (current?.imgPath) await supabase.storage.from(STORAGE_BUCKET).remove([current.imgPath]);
      }
    }
    const payload: Record<string, unknown> = {
      name: updatedFields.name,
      region: updatedFields.region,
      price: updatedFields.price,
      beds: updatedFields.beds,
      baths: updatedFields.baths,
      sqft: updatedFields.sqft,
      tag: updatedFields.tag,
      shape: updatedFields.shape,
      description: updatedFields.description,
    };
    if (imgUrl !== undefined) payload.img_url = imgUrl;
    if (imgPath !== undefined) payload.img_path = imgPath;
    const { error } = await supabase.from("listings").update(payload).eq("id", id);
    if (error) {
      console.error("[CMS] Update:", error.message);
      throw new Error(error.message);
    }
    await fetchListings();
  };

  const deleteListing = async (id: string) => {
    const listing = data.listings.find((l) => l.id === id);

    // First delete image from storage if it exists to ensure no orphaned assets are left
    if (listing?.imgPath) {
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([listing.imgPath]);
      if (storageError) {
        console.error("[CMS] Delete storage image failed:", storageError.message);
      } else {
        console.log("[CMS] Deleted image from storage:", listing.imgPath);
      }
    }

    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) {
      console.error("[CMS] Delete:", error.message);
      throw new Error(error.message);
    }
    await fetchListings();
  };

  const resetToDefault = () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    setData((prev) => ({ ...DEFAULT_DATA, listings: prev.listings }));
  };

  const login = (email: string, password: string): boolean => {
    if (email === "admin@joselhomes.com" && password === "admin123") {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") window.sessionStorage.setItem(AUTH_SESSION_KEY, "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") window.sessionStorage.removeItem(AUTH_SESSION_KEY);
  };

  return (
    <CMSContext.Provider
      value={{
        data,
        listingsLoading,
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
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error("useCMS must be used within a CMSProvider");
  return context;
};
