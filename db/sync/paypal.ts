import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";


 const syncPayPal = async () => {
  try {
    const { data, error } = await supabase
      .from("paypal")
      .select("link")
      .single();
    if (error) {
      console.error("Error fetching PayPal link from Supabase:", error.message);
      return;
    }
    if (data?.link) {
      AsyncStorage.setItem("paypal", data.link);
    } else {
      console.warn("No PayPal link found in Supabase.");
    }
  } catch (error) {
    console.error("Unexpected error fetching PayPal link:", error);
  }
};

export default syncPayPal;