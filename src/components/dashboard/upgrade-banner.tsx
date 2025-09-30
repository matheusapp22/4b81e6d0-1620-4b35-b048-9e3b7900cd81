import { useState } from "react";
import { Crown, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { CheckoutModal } from "@/components/checkout-modal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DashboardUpgradeBanner() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    type: 'pro' | 'premium';
    name: string;
    price: string;
  } | null>(null);

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      return data;
    },
  });

  // Não mostrar banner se já tem plano Pro ou Premium
  if (subscription && subscription.plan_type !== 'free') {
    return null;
  }

  const handleUpgrade = (planType: 'pro' | 'premium', planName: string, price: string) => {
    setSelectedPlan({ type: planType, name: planName, price });
    setCheckoutOpen(true);
  };

  return (
    <>
      <GlassCard variant="premium" className="p-8 relative overflow-hidden group">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-float"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h3 className="text-title font-bold">Desbloqueie Todo o Potencial</h3>
            <Badge variant="secondary" className="animate-bounce">
              Oferta Especial
            </Badge>
          </div>

          <p className="text-caption text-muted-foreground mb-6">
            Escolha o plano ideal para o seu negócio e transforme sua gestão de agendamentos
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Plano Pro */}
            <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-blue-500" />
                <h4 className="text-lg font-bold">Plano Pro</h4>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold gradient-text">R$ 29</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Agendamentos ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Notificações WhatsApp + Push</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Relatórios avançados</span>
                </li>
              </ul>
              <Button 
                variant="futuristic" 
                className="w-full group/btn"
                onClick={() => handleUpgrade('pro', 'Pro', 'R$ 29')}
              >
                <Zap className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                Assinar Pro
              </Button>
            </div>

            {/* Plano Premium */}
            <div className="bg-gradient-primary/10 backdrop-blur-sm p-6 rounded-xl border-2 border-primary hover:border-primary/60 transition-all hover:scale-105 relative">
              <Badge className="absolute -top-3 -right-3 bg-gradient-primary text-white border-0 animate-pulse">
                Mais Popular
              </Badge>
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h4 className="text-lg font-bold">Plano Premium</h4>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold gradient-text">R$ 59</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Tudo do Pro +</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Multiusuários ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>White label + API</span>
                </li>
              </ul>
              <Button 
                variant="neon" 
                className="w-full group/btn"
                onClick={() => handleUpgrade('premium', 'Premium', 'R$ 59')}
              >
                <Crown className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                Assinar Premium
              </Button>
            </div>
          </div>

          <p className="text-micro text-center text-muted-foreground mt-4">
            Sem compromisso • Cancele quando quiser • Suporte em português
          </p>
        </div>
      </GlassCard>

      {selectedPlan && (
        <CheckoutModal
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          planType={selectedPlan.type}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
        />
      )}
    </>
  );
}
