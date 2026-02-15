import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');
let envVars: Record<string, string> = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) envVars[key.trim()] = value.trim();
    });
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkSurveys() {
    console.log('Checking all vendor surveys...');
    const { data: surveys, error } = await supabase
        .from('surveys')
        .select('id, title, is_active, created_at')
        .eq('target_audience', 'vendor');

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (surveys.length === 0) {
        console.log('No vendor surveys found.');
    } else {
        surveys.forEach(s => {
            console.log(`- [${s.is_active ? 'ACTIVE' : 'INACTIVE'}] ${s.title} (${s.id}) Created: ${s.created_at}`);
        });
    }
}

checkSurveys();
