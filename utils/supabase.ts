import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ygtlsiifupyoepxfamcn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndGxzaWlmdXB5b2VweGZhbWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTc3NTQsImV4cCI6MjA2MjM3Mzc1NH0.bwHWf-7O4e3R67iRSvPes30L4kt8elsKRnE3SSNgog0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
