// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import ModernTreasury from "npm:modern-treasury";
import { VentureRequest } from "./types.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

console.log('supabase url: ', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

const modernTreasury = new ModernTreasury({
  apiKey: Deno.env.get("MODERN_TREASURY_API_KEY"),
  organizationId: Deno.env.get("MODERN_TREASURY_ORG_ID"),
});

const createNewLedgerForVenture = async (ventureName: string): Promise<string> => {
  const ledgerResponse = await modernTreasury.ledgers.create({
    name: `Venture ${ventureName}`,
  });

  if (!ledgerResponse || !ledgerResponse.id) {
    throw new Error('Error creating ledger in Modern Treasury');
  }

  const vTokenAccount = await modernTreasury.ledgerAccounts.create({
    name: "V-Token Issuance Account",
    description: "Account for issuing value tokens",
    currency: "VTK",
    normal_balance: "debit",
    currency_exponent: 0,
    ledger_id: ledgerResponse.id,
  });

  if (!vTokenAccount || !vTokenAccount.id) {
    throw new Error("Error creating v token issuer account in Modern Treasury");
  }

  const aTokenAccount = await modernTreasury.ledgerAccounts.create({
    name: "A-Token Issuance Account",
    description: "Account for issuing Asset tokens",
    currency: "ATK",
    normal_balance: "debit",
    currency_exponent: 0,
    ledger_id: ledgerResponse.id,
  });

  if (!aTokenAccount || !aTokenAccount.id) {
    throw new Error("Error creating a token issuer account in Modern Treasury");
  }

  return ledgerResponse.id;
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    // Parse request body
    const body = await req.json() as VentureRequest;
    const { name, description, image_url, v_token_amount, category, end_date } = body

    // Validate required fields
    if (!name || v_token_amount === undefined || !category) {
      console.error('missing required fields', body);
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const ledgerId = await createNewLedgerForVenture(name); 

    // Insert new venture
    const { data, error } = await supabase
      .from("ventures")
      .insert([
        {
          name,
          description,
          image_url,
          v_token_amount,
          category,
          end_date,
          ledger_id: ledgerId
        },
      ])
      .select();

    // Handle insertion error
    if (error) {
      console.error("Error inserting venture to db:", error);
      await modernTreasury.ledgers.del(ledgerId);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ success: true, venture: data, ledger_id: ledgerId }),
      { status: 201 }
    );

  } catch (err) {
    console.error("failed to create new venture", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add_venture' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
