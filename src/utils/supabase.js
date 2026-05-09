import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const SITE_URL = 'https://repwar.live'

export const supabase = createClient(supabaseUrl, supabaseKey)
