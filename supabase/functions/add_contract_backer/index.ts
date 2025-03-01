// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import ModernTreasury from "npm:modern-treasury";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

console.log('supabase url: ', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

const modernTreasury = new ModernTreasury({
  apiKey: Deno.env.get("MODERN_TREASURY_API_KEY"),
  organizationId: Deno.env.get("MODERN_TREASURY_ORG_ID"),
});

const getUserVTokenAccountId = async (userId: string): Promise<string> => {
  const { data, error } = await supabase.from('user_ledger_accounts').select('account_id').eq('user_id', userId).eq('account_type', 'V_token');
  if (error) {
    throw new Error(`Failed to fetch account if for user_id: ${userId} `, error)
  }
  return data[0].account_id
}

const createTransaction = async ({ fromUser, toUser, amount }: { fromUser: string, toUser: string, amount: number }) => {
  const fromUserAccount = await getUserVTokenAccountId(fromUser);
  const toUserAcount = await getUserVTokenAccountId(toUser);
    
  return await modernTreasury.ledgerTransactions.create({
    status: "pending",
    ledger_entries: [
      {
        ledger_account_id: fromUserAccount,
        amount,
        direction: "debit",
      },
      {
        ledger_account_id: toUserAcount,
        amount,
        direction: "credit",
      },
    ],
    description: `Transfer of ${amount} VTK from ${fromUser} to ${toUser}`,
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const { smart_contract_id, backer_user_id, staking_v_tokens_amount } = await req.json();

    if (!smart_contract_id || !backer_user_id || staking_v_tokens_amount === undefined) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const contractHolderResponse = await supabase.from('smart_contracts').select('holder_user_id').eq('id', smart_contract_id);
    if (contractHolderResponse.error) {
      console.error('error getting smart contract holder id: ', contractHolderResponse.error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
    const contractHolderUserId = contractHolderResponse.data[0].holder_user_id;

    const transaction = await createTransaction({ 
      fromUser: backer_user_id,
      toUser: contractHolderUserId,
      amount: staking_v_tokens_amount
    })
    
    if (!transaction || !transaction.id) {
      console.error('unable to create transaction');
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
    const { data, error } = await supabase
      .from("smart_contract_backers")
      .insert([
        {
          smart_contract_id,
          backer_user_id,
          staking_v_tokens_amount,
          transaction_id: transaction.id
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
