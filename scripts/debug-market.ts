import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugMarket() {
    console.log('--- Market Diagnostics ---');

    // 1. Check Profiles count
    const { data: profiles, error: pError, count: pCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

    if (pError) console.error('Error fetching profiles:', pError.message);
    else console.log(`Total Profiles: ${pCount}`);

    // 2. Check Requests count
    const { data: requests, error: rError, count: rCount } = await supabase
        .from('requests')
        .select('*', { count: 'exact' });

    if (rError) console.error('Error fetching requests:', rError.message);
    else console.log(`Total Requests (visible to anon): ${rCount}`);

    // 3. Check if 'open' requests exist specifically
    const { data: openReqs, count: openCount } = await supabase
        .from('requests')
        .select('*', { count: 'exact' })
        .eq('status', 'open');

    console.log(`Total 'open' Requests: ${openCount}`);

    // 4. Try to see if there's an RLS issue by checking if we get any data
    if (rCount === 0) {
        console.log('WARNING: 0 requests visible. This might be due to RLS or empty table.');
    } else {
        console.log('Sample request IDs:', requests?.map(r => r.id));
    }
}

debugMarket();
