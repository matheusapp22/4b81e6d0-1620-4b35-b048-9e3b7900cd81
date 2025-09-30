import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateTransactionRequest {
  plan_type: 'pro' | 'premium';
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
    document_type: 'CPF' | 'CNPJ';
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: CreateTransactionRequest = await req.json();

    // Define valores dos planos
    const planPrices = {
      pro: 29.00,
      premium: 59.00
    };

    const amount = planPrices[body.plan_type];

    // Cria transação na Sunize
    const sunizeResponse = await fetch('https://api.sunize.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('SUNIZE_API_KEY') ?? '',
        'x-api-secret': Deno.env.get('SUNIZE_API_SECRET') ?? '',
      },
      body: JSON.stringify({
        external_id: `sub_${user.id}_${Date.now()}`,
        total_amount: amount,
        payment_method: 'PIX',
        items: [
          {
            id: body.plan_type,
            title: `Plano ${body.plan_type === 'pro' ? 'Pro' : 'Premium'}`,
            description: `Assinatura mensal - Plano ${body.plan_type}`,
            price: amount,
            quantity: 1,
            is_physical: false
          }
        ],
        ip: (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || '127.0.0.1',
        customer: {
          name: body.customer.name,
          email: body.customer.email,
          phone: body.customer.phone,
          document_type: body.customer.document_type,
          document: body.customer.document
        }
      })
    });

    if (!sunizeResponse.ok) {
      const errorData = await sunizeResponse.text();
      console.error('Sunize error:', errorData);
      throw new Error(`Erro ao criar transação: ${errorData}`);
    }

    const transaction = await sunizeResponse.json();

    console.log('Transação criada:', transaction);

    return new Response(
      JSON.stringify({
        transaction_id: transaction.id,
        pix_payload: transaction.pix?.payload,
        status: transaction.status,
        amount: transaction.total_value || amount
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});