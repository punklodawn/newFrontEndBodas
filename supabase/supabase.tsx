// supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://llilswxrkaroyatuhokc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWxzd3hya2Fyb3lhdHVob2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NzcwNDQsImV4cCI6MjA1NDU1MzA0NH0.1yaJySmAljR7TGzghHbCyPUDtkyoQEeH54SZVJYmFL8';

export const supabase = createClient(supabaseUrl, supabaseKey);