


// ======================================================
// Students Homework AI
// Version 5.1
// supabase.js
// ======================================================

const SUPABASE_URL =
    "https://gqzrnfjriftgtilxaeyn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "PASTE_YOUR_COMPLETE_PUBLISHABLE_KEY_HERE";

const supabase =
    window.supabase.createClient(

        SUPABASE_URL,

        SUPABASE_PUBLISHABLE_KEY

    );

console.log(
    "Supabase Connected"
);
