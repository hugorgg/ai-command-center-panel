// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yooauakrlsiifwowdqjb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb2F1YWtybHNpaWZ3b3dkcWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTQwOTgsImV4cCI6MjA2NDM5MDA5OH0.ped7EtYedDF4XVP3O-Wbi7yO9Cq1haVLNKzfIzZLr0g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);