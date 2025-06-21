import { supabase } from "@/utils/supabase";

export async function fetchVersionFromSupabase(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("versions")
      .select("database_version")
      .single();
    if (error) {
      console.error(error);
      return null;
    }
    return data.database_version;
  } catch (error) {
    console.error("Error fetching database version:", error);
    return null;
  }
}

export async function fetchAppVersionFromSupabase(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("versions")
      .select("app_version")
      .single();
    if (error) {
      console.error(error);
      return null;
    }
    return data.app_version;
  } catch (error) {
    console.error("Error fetching app version:", error);
    return null;
  }
}

export default {
  fetchVersionFromSupabase,
  fetchAppVersionFromSupabase,
};
