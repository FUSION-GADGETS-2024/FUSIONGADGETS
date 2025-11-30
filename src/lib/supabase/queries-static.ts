// Static queries for build-time data fetching (SSG)
// These use the service role key and don't require cookies

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a static client for build-time queries
function createStaticClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Get all categories for static generation
export async function getAllCategoriesStatic() {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data;
}

// Get all product IDs for static generation
export async function getAllProductIdsStatic() {
  const supabase = createStaticClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('status', 'Active');

  if (error) {
    console.error('Error fetching product IDs:', error);
    return [];
  }

  return data;
}
