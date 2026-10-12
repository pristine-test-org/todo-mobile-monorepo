import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  created_at: string;
};

// The project this list lives in. Both values are public by design (they ship inside the app);
// the row-level security policies decide what the key may do. EXPO_PUBLIC_* variables win when set.
const DEFAULT_URL = "https://hszqtfynyogshhltamep.supabase.co";
const DEFAULT_PUBLISHABLE_KEY = "sb_publishable_aCtosSr17ISoXGsoTazAbA_MiMNv78_";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_PUBLISHABLE_KEY;

/** Null when the app was built without Supabase settings; the screen shows a setup message instead. */
export const supabase: SupabaseClient | null =
  url && publishableKey
    ? createClient(url, publishableKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export const missingConfig = supabase
  ? null
  : "Tally Mobile can't reach its database yet. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then restart.";
