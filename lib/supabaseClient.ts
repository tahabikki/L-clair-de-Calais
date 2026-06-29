import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false }
});

export const MEDIA_BUCKET = "media";
