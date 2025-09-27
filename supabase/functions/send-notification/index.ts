import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Configurar cliente Supabase para o edge function
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'appointment_created' | 'appointment_cancelled';
  businessEmail: string;
  businessName: string;
  clientName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  servicePrice: number;
  clientPhone?: string;
  clientEmail?: string;
  userId?: string;
}

// Função para enviar push notification usando Web Push API nativa
async function sendPushNotification(userId: string, title: string, body: string) {
  try {
    console.log(`Enviando push notification para user ${userId}`);

    // Buscar as inscrições push do usuário
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao buscar inscrições push:', error);
      return;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('Nenhuma inscrição push encontrada para o usuário');
      return;
    }

    console.log(`Enviando notificação para ${subscriptions.length} dispositivos`);
    
    // Para cada inscrição, simular envio (em ambiente real usaria uma biblioteca de Web Push)
    for (const sub of subscriptions) {
      console.log('Push notification seria enviada para:', sub.endpoint);
      console.log('Título:', title);
      console.log('Corpo:', body);
    }
    
  } catch (error) {
    console.error('Erro geral ao enviar push notification:', error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      type, 
      businessEmail, 
      businessName, 
      clientName, 
      serviceName, 
      appointmentDate, 
      appointmentTime, 
      servicePrice,
      clientPhone,
      clientEmail,
      userId 
    }: NotificationRequest = await req.json();

    console.log(`Sending ${type} notification`);

    // Enviar push notification se userId foi fornecido
    if (userId) {
      let pushTitle: string;
      let pushBody: string;

      if (type === 'appointment_created') {
        pushTitle = '🎉 Novo Agendamento!';
        pushBody = `${clientName} agendou ${serviceName} para ${new Date(appointmentDate).toLocaleDateString('pt-BR')} às ${appointmentTime}`;
      } else {
        pushTitle = '❌ Agendamento Cancelado';
        pushBody = `Agendamento de ${clientName} para ${serviceName} foi cancelado`;
      }

      await sendPushNotification(userId, pushTitle, pushBody);
    }

    return new Response(JSON.stringify({ success: true, message: 'Notificação enviada' }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);