import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('banners').insert({
    title: 'test',
    position: 'appointment_hero',
    image_url: 'test.jpg'
  });
  console.log(error);
}

run();
