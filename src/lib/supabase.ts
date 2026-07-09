import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Add them to .env.local to enable backend features.",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

export interface DbListing {
  id: string;
  name: string;
  region: string;
  price: string;
  img_url: string;
  img_path: string | null;
  beds: number;
  baths: number;
  sqft: string;
  tag: string;
  shape: "arch" | "rounded";
  description: string;
  images: string[];
  image_paths: string[];
  created_at: string;
}

export interface DbInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
}
