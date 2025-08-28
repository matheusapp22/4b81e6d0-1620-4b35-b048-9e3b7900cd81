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
  Globe
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Online",
    description: "Página personalizada para seus clientes agendarem 24/7",
    badge: "ESSENCIAL",
    color: "text-primary"
  },
  {
    icon: Bell,
    title: "Notificações Automáticas",
    description: "WhatsApp, email e push notifications para lembrar clientes",
    badge: "AUTOMATIZADO",
    color: "text-neon-blue"
  },
  {
    icon: CreditCard,
    title: "Pagamentos Integrados",
    description: "Pix, cartão e parcelamento direto na plataforma",
    badge: "PREMIUM",
    color: "text-neon-green"
  },
  {
    icon: BarChart3,
    title: "Relatórios Inteligentes",
    description: "Analytics em tempo real e exportação para Excel/PDF",
    badge: "PRO",
    color: "text-neon-pink"
  },
  {
    icon: Users,
    title: "CRM Integrado",
    description: "Histórico completo e campanhas personalizadas",
    badge: "COMPLETO",
    color: "text-primary"
  },
  {
    icon: Smartphone,
    title: "App Mobile Nativo",
    description: "Gerencie tudo pelo celular com notificações push",
    badge: "MOBILE",
    color: "text-neon-blue"
  },
  {
    icon: Clock,
    title: "Horários Flexíveis",
    description: "Configure pausas, feriados e múltiplos funcionários",
    badge: "FLEXÍVEL",
    color: "text-neon-green"
  },
  {
    icon: Zap,
    title: "Automações",
    description: "Workflows automáticos para follow-up e reativação",
    badge: "IA",
    color: "text-neon-pink"
  },
  {
    icon: Shield,
    title: "Segurança LGPD",
    description: "Dados protegidos com criptografia de ponta a ponta",
    badge: "SEGURO",
    color: "text-primary"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="glass-card px-4 py-2">
            ⚡ Funcionalidades Completas
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Tudo que você precisa<br />
            <span className="gradient-text">em uma plataforma</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Do agendamento ao pagamento, da notificação aos relatórios. 
            Uma solução completa para profissionais modernos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlassCard 
              key={index} 
              hover 
              className="p-6 space-y-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  {feature.badge}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
        
        {/* Integration Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <GlassCard variant="neon" className="p-6 text-center space-y-4">
            <Globe className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-semibold">Integrações Nativas</h3>
            <p className="text-muted-foreground">
              Google Agenda, Zoom, WhatsApp Business, Mercado Pago e muito mais
            </p>
          </GlassCard>
          
          <GlassCard variant="neon" className="p-6 text-center space-y-4">
            <Zap className="w-12 h-12 text-neon-blue mx-auto" />
            <h3 className="text-xl font-semibold">Deploy Instantâneo</h3>
            <p className="text-muted-foreground">
              Sua página de agendamento no ar em menos de 5 minutos
            </p>
          </GlassCard>
          
          <GlassCard variant="neon" className="p-6 text-center space-y-4">
            <Shield className="w-12 h-12 text-neon-green mx-auto" />
            <h3 className="text-xl font-semibold">Suporte 24/7</h3>
            <p className="text-muted-foreground">
              Chat ao vivo, tutoriais em vídeo e onboarding personalizado
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}