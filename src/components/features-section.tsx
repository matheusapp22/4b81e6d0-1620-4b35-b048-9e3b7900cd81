import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  Calendar, 
  Bell, 
  CreditCard, 
  BarChart3, 
  Users, 
  Smartphone, 
  Clock,
  Zap,
  Shield,
  Globe,
  Sparkles,
  Star,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Online",
    description: "Página personalizada para seus clientes agendarem 24/7 com interface intuitiva",
    badge: "ESSENCIAL",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Bell,
    title: "Notificações Inteligentes",
    description: "WhatsApp, email e push notifications automáticas para lembrar clientes",
    badge: "AUTOMATIZADO",
    color: "text-info",
    bgColor: "bg-info/10"
  },
  {
    icon: CreditCard,
    title: "Pagamentos Integrados",
    description: "Pix, cartão e parcelamento direto na plataforma com segurança total",
    badge: "PREMIUM",
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    icon: BarChart3,
    title: "Analytics Avançados",
    description: "Relatórios em tempo real e insights para crescer seu negócio",
    badge: "PRO",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Users,
    title: "CRM Completo",
    description: "Histórico detalhado e campanhas personalizadas para cada cliente",
    badge: "COMPLETO",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Smartphone,
    title: "App Mobile Nativo",
    description: "Gerencie tudo pelo celular com sincronização em tempo real",
    badge: "MOBILE",
    color: "text-info",
    bgColor: "bg-info/10"
  },
  {
    icon: Clock,
    title: "Horários Flexíveis",
    description: "Configure pausas, feriados e múltiplos funcionários facilmente",
    badge: "FLEXÍVEL",
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    icon: Zap,
    title: "Automações IA",
    description: "Workflows inteligentes para follow-up e reativação de clientes",
    badge: "IA",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Shield,
    title: "Segurança LGPD",
    description: "Dados protegidos com criptografia militar e compliance total",
    badge: "SEGURO",
    color: "text-primary",
    bgColor: "bg-primary/10"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 glass-surface px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-cosmic-drift"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl animate-float"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 glass-neon px-6 py-3 rounded-full text-sm font-semibold animate-neon-pulse">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="gradient-text">Recursos Premium</span>
          </div>
          <h2 className="text-hero">
            <span className="block text-foreground">Tudo que você precisa</span>
            <span className="block gradient-text">em uma plataforma</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Desde agendamentos até pagamentos, tenha controle total do seu negócio
            com as ferramentas mais avançadas do mercado.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassCard 
              key={index} 
              variant="premium"
              hover
              className="p-6 space-y-4 group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-card`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <div className="glass-neon px-3 py-1.5 rounded-full text-xs font-semibold">
                  <span className="gradient-text">{feature.badge}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold gradient-text">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
              
              {/* Hover Effect Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </GlassCard>
          ))}
        </div>
        
        {/* Integration Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <GlassCard variant="premium" hover className="p-8 text-center space-y-6 group">
            <div className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 transition-all duration-500">
              <Globe className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold gradient-text">Integrações Nativas</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Google Agenda, Zoom, WhatsApp Business, Mercado Pago e muito mais
            </p>
          </GlassCard>
          
          <GlassCard variant="premium" hover className="p-8 text-center space-y-6 group">
            <div className="w-16 h-16 bg-gradient-to-r from-info to-neon-blue rounded-3xl flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 transition-all duration-500">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold gradient-text">Deploy Instantâneo</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sua página de agendamento no ar em menos de 5 minutos
            </p>
          </GlassCard>
          
          <GlassCard variant="premium" hover className="p-8 text-center space-y-6 group">
            <div className="w-16 h-16 bg-gradient-to-r from-success to-neon-green rounded-3xl flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 transition-all duration-500">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold gradient-text">Suporte 24/7</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chat ao vivo, tutoriais em vídeo e onboarding personalizado
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}