import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SunizeWebhook {
  id: string;
  external_id: string;
  total_amount: number;
  status: 'AUTHORIZED' | 'PENDING' | 'CHARGEBACK' | 'FAILED' | 'IN_DISPUTE';
  payment_method: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhook: SunizeWebhook = await req.json();
    
    console.log('Webhook recebido:', webhook);

    // Extrai user_id do external_id (formato: sub_{user_id}_{timestamp})
    const externalIdParts = webhook.external_id.split('_');
    if (externalIdParts.length < 2 || externalIdParts[0] !== 'sub') {
      console.error('External ID inválido:', webhook.external_id);
      return new Response('Invalid external_id', { status: 400, headers: corsHeaders });
    }

    const userId = externalIdParts[1];

    // Usa service role key para atualizar subscription
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Mapeia status da Sunize para status da subscription
    let subscriptionStatus: 'active' | 'cancelled' | 'past_due';
    let shouldUpdate = false;

    switch (webhook.status) {
      case 'AUTHORIZED':
        subscriptionStatus = 'active';
        shouldUpdate = true;
        break;
      case 'FAILED':
        subscriptionStatus = 'cancelled';
        shouldUpdate = true;
        break;
      case 'CHARGEBACK':
        subscriptionStatus = 'cancelled';
        shouldUpdate = true;
        break;
      case 'IN_DISPUTE':
        subscriptionStatus = 'past_due';
        shouldUpdate = true;
        break;
      case 'PENDING':
        // Não atualiza status, apenas aguarda pagamento
        shouldUpdate = false;
        break;
    }

    if (shouldUpdate) {
      // Determina o plano baseado no valor
      let planType: 'free' | 'pro' | 'premium' = 'free';
      if (webhook.total_amount >= 50) {
        planType = 'premium';
      } else if (webhook.total_amount >= 25) {
        planType = 'pro';
      }

      // Atualiza ou cria subscription
      const { error: upsertError } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_type: planType,
          status: subscriptionStatus,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 dias
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        console.error('Erro ao atualizar subscription:', upsertError);
        throw upsertError;
      }

      console.log(`Subscription atualizada: user=${userId}, plan=${planType}, status=${subscriptionStatus}`);
    }

    // Retorna 200 para confirmar recebimento do webhook
    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});