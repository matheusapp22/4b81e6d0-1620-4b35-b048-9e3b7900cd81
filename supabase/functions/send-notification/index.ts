import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

// Função para enviar push notification
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

    // Preparar payload da notificação
    const payload = JSON.stringify({
      title,
      body,
      primaryKey: crypto.randomUUID(),
    });

    // Enviar notificação para cada inscrição
    for (const sub of subscriptions) {
      try {
        const subscription = JSON.parse(sub.subscription);
        
        // Usar Web Push API para enviar notificação
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Authorization': `key=${Deno.env.get('FCM_SERVER_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: subscription.endpoint.split('/').pop(),
            notification: {
              title,
              body,
              icon: '/favicon.ico',
            },
            data: {
              primaryKey: crypto.randomUUID(),
            }
          }),
        });

        if (!response.ok) {
          console.error('Erro ao enviar push notification:', await response.text());
        } else {
          console.log('Push notification enviada com sucesso');
        }
      } catch (pushError) {
        console.error('Erro ao processar inscrição push:', pushError);
      }
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

    console.log(`Sending ${type} notification to ${businessEmail}`);

    let subject: string;
    let html: string;

    if (type === 'appointment_created') {
      subject = `🎉 Novo Agendamento - ${serviceName}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Novo Agendamento!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e293b; margin-top: 0;">Detalhes do Agendamento</h2>
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #475569;">Cliente:</strong>
                <span style="color: #64748b;">${clientName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #475569;">Serviço:</strong>
                <span style="color: #64748b;">${serviceName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #475569;">Data:</strong>
                <span style="color: #64748b;">${new Date(appointmentDate).toLocaleDateString('pt-BR')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #475569;">Horário:</strong>
                <span style="color: #64748b;">${appointmentTime}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #475569;">Valor:</strong>
                <span style="color: #10b981; font-weight: bold;">R$ ${servicePrice.toFixed(2).replace('.', ',')}</span>
              </div>
              ${clientPhone ? `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #475569;">Telefone:</strong>
                  <span style="color: #64748b;">${clientPhone}</span>
                </div>
              ` : ''}
              ${clientEmail ? `
                <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                  <strong style="color: #475569;">Email:</strong>
                  <span style="color: #64748b;">${clientEmail}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div style="background: #dcfce7; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="color: #166534; margin: 0; font-weight: 500;">
              💰 Este agendamento foi adicionado à sua receita mensal!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Enviado por ${businessName}
            </p>
          </div>
        </div>
      `;
    } else { // appointment_cancelled
      subject = `❌ Agendamento Cancelado - ${serviceName}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">❌ Agendamento Cancelado</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e293b; margin-top: 0;">Detalhes do Cancelamento</h2>
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #475569;">Cliente:</strong>
                <span style="color: #64748b;">${clientName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #475569;">Serviço:</strong>
                <span style="color: #64748b;">${serviceName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #475569;">Data:</strong>
                <span style="color: #64748b;">${new Date(appointmentDate).toLocaleDateString('pt-BR')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #475569;">Horário:</strong>
                <span style="color: #64748b;">${appointmentTime}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                <strong style="color: #475569;">Valor:</strong>
                <span style="color: #ef4444; font-weight: bold;">- R$ ${servicePrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="color: #991b1b; margin: 0; font-weight: 500;">
              💸 Este valor foi descontado da sua receita mensal.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Enviado por ${businessName}
            </p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: `${businessName} <onboarding@resend.dev>`,
      to: [businessEmail],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

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

    return new Response(JSON.stringify(emailResponse), {
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