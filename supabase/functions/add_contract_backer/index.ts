// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

console.log('supabase url: ', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const { smart_contract_id, backer_user_id, staking_v_tokens_amount } = await req.json();

    if (!smart_contract_id || !backer_user_id || staking_v_tokens_amount === undefined) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from("smart_contract_backers")
      .insert([
        {
          smart_contract_id,
          backer_user_id,
          staking_v_tokens_amount,
        },
      ])
      .select();

    if (error) {
      console.error('error insert smart_contract_backer: ', error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true, backer: data }), { status: 201 });

  } catch (err) {
    console.error('general error: ', err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add_contract_backer' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
