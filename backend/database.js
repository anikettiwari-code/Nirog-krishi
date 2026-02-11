const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.log('Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function testConnection() {
    try {
        const { data, error } = await supabase.from('scan_results').select('count');
        if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
            console.error('❌ Supabase connection error:', error.message);
        } else {
            console.log('✅ Supabase connected successfully');
        }
    } catch (err) {
        console.error('❌ Supabase connection failed:', err.message);
    }
}

testConnection();

module.exports = supabase;
