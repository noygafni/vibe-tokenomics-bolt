// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import ModernTreasury from "npm:modern-treasury";
import { UserToVentureRequest } from "./type.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

console.log('supabase url: ', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

const modernTreasury = new ModernTreasury({
  apiKey: Deno.env.get("MODERN_TREASURY_API_KEY"),
  organizationId: Deno.env.get("MODERN_TREASURY_ORG_ID"),
});


const createUserAccounts = async (ventureId: string, userId: string): Promise<void> => {

  const ventureLedgerIdResponse = await supabase.from('ventures').select('ledger_id').eq('id', ventureId);
  if (ventureLedgerIdResponse.error) {
    throw new Error('error fething venture ledger id: ', ventureLedgerIdResponse.error);
  }

  const userNameResponse = await supabase.from('profiles').select('name').eq('id', userId);
  if (userNameResponse.error) {
    throw new Error('error fething user name: ', userNameResponse.error);
  }

  const ledgerId = ventureLedgerIdResponse.data[0].ledger_id;
  const userName = userNameResponse.data[0].name;

  const vTokenAccount = await modernTreasury.ledgerAccounts.create({
    name: `V-Token User: ${userName}`,
    description: `Account for issuing Value tokens for userId: ${userId}`,
    currency: "VTK",
    normal_balance: "credit",
    currency_exponent: 0,
    ledger_id: ledgerId,
  });

  if (!vTokenAccount || !vTokenAccount.id) {
    throw new Error("Error creating V-token account for user in Modern Treasury");
  }

  const aTokenAccount = await modernTreasury.ledgerAccounts.create({
    name: `A-Token User: ${userName}`,
    description: `Account for issuing Asset tokens for userId: ${userId}`,
    currency: "ATK",
    normal_balance: "credit",
    currency_exponent: 0,
    ledger_id: ledgerId,
  });

  if (!aTokenAccount || !aTokenAccount.id) {
    throw new Error("Error creating A-token account for user in Modern Treasury");
  }

  const VTokenResponse = await supabase
      .from("user_ledger_accounts")
      .insert([
        {
          user_id: userId,
          venture_id: ventureId,
          account_id: vTokenAccount.id,
          account_type: 'V_token'
        },
      ])
      .select();

  if (VTokenResponse.error) {
    throw new Error('Error inserting V-token account to user_ledger_accounts', VTokenResponse.error)
  }

  const ATokenResponse = await supabase
      .from("user_ledger_accounts")
      .insert([
        {
          user_id: userId,
          venture_id: ventureId,
          account_id: aTokenAccount.id,
          account_type: 'A_token'
        },
      ])
      .select();

  if (ATokenResponse.error) {
    throw new Error('Error inserting A-token account to user_ledger_accounts', ATokenResponse.error)
  }
}


Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    // Parse request body
    const body = await req.json() as UserToVentureRequest;
    const { user_id, venture_id, type } = body

    // Validate required fields
    if (user_id === undefined || venture_id === undefined || !type) {
      console.error('missing required fields', body);
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Insert new venture
    const { data, error } = await supabase
      .from("user_to_venture")
      .insert([
        {
          user_id,
          venture_id,
          type
        },
      ])
      .select();
      
    // Handle insertion error
    if (error) {
      console.error("Error inserting user_to_venture to db:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }

    await createUserAccounts(venture_id, user_id); 

    return new Response(
      JSON.stringify({ success: true, user_to_venture: data }),
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

  curl -i --location --request POST 'http://localhost:54321/functions/v1/add_venture' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
