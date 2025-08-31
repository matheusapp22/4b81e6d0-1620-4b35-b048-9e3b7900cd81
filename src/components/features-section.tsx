import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
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
    color: "text-neon-blue",
    bgColor: "bg-neon-blue/10"
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
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/10"
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
    color: "text-neon-blue",
    bgColor: "bg-neon-blue/10"
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
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/10"
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
    <section className="py-32 px-6 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 dot-pattern opacity-20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-8 mb-24">
          <Badge variant="secondary" className="glass-card px-8 py-4 text-sm font-bold border border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Funcionalidades Completas
          </Badge>
          <h2 className="text-display">
            Tudo que você precisa<br />
            <span className="gradient-text">em uma plataforma</span>
          </h2>
          <p className="text-body text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Do agendamento ao pagamento, da notificação aos relatórios. 
            Uma solução completa para profissionais modernos que buscam excelência.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <GlassCard 
              key={index} 
              variant="premium" 
              hover 
              className="p-8 space-y-6 animate-scale-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-16 h-16 rounded-3xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-all duration-400 shadow-card`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <Badge 
                  className="status-indicator info px-3 py-1"
                >
                  {feature.badge}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-title font-bold">{feature.title}</h3>
                <p className="text-caption leading-relaxed">{feature.description}</p>
              </div>

              {/* Hover Effect Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-b-2xl"></div>
            </GlassCard>
          ))}
        </div>
        
        {/* Integration Highlights */}
        <div className="mt-24 grid md:grid-cols-3 gap-10">
          <GlassCard variant="elevated" className="p-8 text-center space-y-6 group hover:scale-105 transition-all duration-500">
            <div className="relative">
              <Globe className="w-16 h-16 text-primary mx-auto" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-bounce-subtle">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="text-title font-bold">Integrações Nativas</h3>
            <p className="text-caption leading-relaxed">
              Google Agenda, Zoom, WhatsApp Business, Mercado Pago e muito mais
            </p>
          </GlassCard>
          
          <GlassCard variant="elevated" className="p-8 text-center space-y-6 group hover:scale-105 transition-all duration-500">
            <div className="relative">
              <Zap className="w-16 h-16 text-neon-blue mx-auto" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center animate-bounce-subtle">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="text-title font-bold">Deploy Instantâneo</h3>
            <p className="text-caption leading-relaxed">
              Sua página de agendamento no ar em menos de 5 minutos
            </p>
          </GlassCard>
          
          <GlassCard variant="elevated" className="p-8 text-center space-y-6 group hover:scale-105 transition-all duration-500">
            <div className="relative">
              <Shield className="w-16 h-16 text-success mx-auto" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-bounce-subtle">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="text-title font-bold">Suporte 24/7</h3>
            <p className="text-caption leading-relaxed">
              Chat ao vivo, tutoriais em vídeo e onboarding personalizado
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}