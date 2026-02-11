
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMarketSchema() {
    console.log('Testing Market Schema...');

    // 1. Check if requests table exists and we can select from it
    const { data, error } = await supabase
        .from('requests')
        .select('count')
        .limit(1);

    if (error) {
        if (error.code === '42P01') { // undefined_table
            console.error('❌ Table "requests" does not exist.');
        } else {
            console.error('❌ Error assessing "requests" table:', error.message);
        }
        return;
    }

    console.log('✅ Table "requests" exists.');

    // 2. Check for columns budget_min and budget_max
    const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select('budget_min, budget_max')
        .limit(1);

    // If table is empty, we can't really check columns easily with select unless we use a different method, 
    // but if the query didn't error on "column does not exist", we are good.
    if (requestError) {
        console.error('❌ Error checking columns:', requestError.message);
    } else {
        console.log('✅ Columns "budget_min" and "budget_max" exist (or query was valid).');
    }

}

testMarketSchema();
