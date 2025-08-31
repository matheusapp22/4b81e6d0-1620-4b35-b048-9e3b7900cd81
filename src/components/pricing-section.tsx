import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Sparkles, TrendingUp } from "lucide-react";

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
    variant: "elegant" as const,
    popular: false,
    bgColor: "bg-muted/30"
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
    variant: "futuristic" as const,
    popular: true,
    bgColor: "bg-gradient-tech"
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
    popular: false,
    bgColor: "bg-gradient-primary/5"
  }
];

export function PricingSection() {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 dot-pattern opacity-15"></div>
      <div className="absolute top-20 left-20 w-40 h-40 bg-primary/2 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary/2 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-8 mb-24">
          <Badge variant="secondary" className="glass-card px-8 py-4 text-sm font-bold border border-primary/20">
            <Crown className="w-4 h-4 mr-2" />
            Planos Transparentes
          </Badge>
          <h2 className="text-display">
            Escolha seu plano ideal<br />
            <span className="gradient-text">sem surpresas</span>
          </h2>
          <p className="text-body text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comece grátis e evolua conforme seu negócio cresce. 
            Sem taxas de instalação ou contratos longos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <GlassCard 
              key={index}
              variant={plan.popular ? "premium" : "default"}
              hover
              className={`p-10 space-y-8 relative animate-scale-in group ${
                plan.popular ? "scale-105 z-10 border-2 border-primary/20" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white border-0 px-6 py-2 shadow-elevated">
                    <Star className="w-4 h-4 mr-2" />
                    MAIS POPULAR
                  </Badge>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-title font-bold">{plan.name}</h3>
                  {plan.popular && (
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="flex items-end gap-2">
                  <span className="metric-display gradient-text">{plan.price}</span>
                  <span className="text-caption mb-2">{plan.period}</span>
                </div>
                <p className="text-caption">{plan.description}</p>
              </div>
              
              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-card">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-caption font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                variant={plan.variant} 
                size="lg" 
                className="w-full group/btn"
              >
                {plan.name === "Premium" && <Crown className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />}
                {plan.name === "Pro" && <Zap className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />}
                {plan.cta}
              </Button>
              
              {plan.name === "Pro" && (
                <p className="text-micro text-center text-muted-foreground">
                  Sem compromisso • Cancele quando quiser
                </p>
              )}

              {/* Hover Effect Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-b-2xl"></div>
            </GlassCard>
          ))}
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-24 text-center space-y-12">
          <div className="flex flex-wrap justify-center items-center gap-12 text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-caption font-medium">Sem taxa de setup</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse"></div>
              <span className="text-caption font-medium">Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-neon-purple rounded-full animate-pulse"></div>
              <span className="text-caption font-medium">Suporte em português</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-caption font-medium">LGPD compliant</span>
            </div>
          </div>
          
          <GlassCard variant="premium" className="p-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <div className="metric-display text-primary mb-2">1000+</div>
                <div className="text-caption font-medium">Profissionais</div>
              </div>
              <div className="w-px h-16 bg-border"></div>
              <div className="text-center">
                <div className="metric-display text-primary mb-2">50k+</div>
                <div className="text-caption font-medium">Agendamentos</div>
              </div>
              <div className="w-px h-16 bg-border"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="metric-display text-primary">4.9</span>
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-caption font-medium">Avaliação</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}