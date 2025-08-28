import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "Até 20 agendamentos/mês",
      "Página de agendamento personalizada",
      "Notificações por email",
      "Dashboard básico",
      "Suporte por email"
    ],
    cta: "Começar Grátis",
    variant: "outline" as const,
    popular: false
  },
  {
    name: "Pro",
    price: "R$ 29",
    period: "/mês",
    description: "Para profissionais em crescimento",
    features: [
      "Agendamentos ilimitados",
      "WhatsApp + Email + Push",
      "Pagamentos integrados (Pix/Cartão)",
      "Relatórios avançados",
      "CRM integrado",
      "Google Agenda + Zoom",
      "Suporte prioritário"
    ],
    cta: "Testar 7 Dias Grátis",
    variant: "hero" as const,
    popular: true
  },
  {
    name: "Premium",
    price: "R$ 59",
    period: "/mês",
    description: "Para empresas com múltiplos funcionários",
    features: [
      "Tudo do Pro +",
      "Multiusuários ilimitados",
      "Automações por IA",
      "White label (sua marca)",
      "API personalizada",
      "Relatórios executivos",
      "Onboarding dedicado",
      "Suporte 24/7"
    ],
    cta: "Falar com Vendas",
    variant: "neon" as const,
    popular: false
  }
];

export function PricingSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="glass-card px-4 py-2">
            💎 Planos Transparentes
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Escolha seu plano ideal<br />
            <span className="gradient-text">sem surpresas</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e evolua conforme seu negócio cresce. 
            Sem taxas de instalação ou contratos longos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <GlassCard 
              key={index}
              variant={plan.popular ? "neon" : "default"}
              hover
              className={`p-8 space-y-6 relative animate-slide-up ${
                plan.popular ? "scale-105 z-10" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-neon text-white border-0 px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    MAIS POPULAR
                  </Badge>
                </div>
              )}
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-muted-foreground mb-1">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                variant={plan.variant} 
                size="lg" 
                className="w-full"
              >
                {plan.name === "Premium" && <Zap className="w-4 h-4 mr-2" />}
                {plan.cta}
              </Button>
              
              {plan.name === "Pro" && (
                <p className="text-xs text-center text-muted-foreground">
                  Sem compromisso • Cancele quando quiser
                </p>
              )}
            </GlassCard>
          ))}
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 text-center space-y-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-green rounded-full"></div>
              <span className="text-sm">Sem taxa de setup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
              <span className="text-sm">Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-pink rounded-full"></div>
              <span className="text-sm">Suporte em português</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">LGPD compliant</span>
            </div>
          </div>
          
          <GlassCard className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Profissionais</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50k+</div>
                <div className="text-sm text-muted-foreground">Agendamentos</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9⭐</div>
                <div className="text-sm text-muted-foreground">Avaliação</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}