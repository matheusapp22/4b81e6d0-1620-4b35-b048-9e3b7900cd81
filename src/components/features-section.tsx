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
    <section className="py-24 bg-secondary/30 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
            <Sparkles className="w-4 h-4" />
            Recursos Premium
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
            <div 
              key={index} 
              className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-card transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium border border-primary/20">
                  {feature.badge}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Integration Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Integrações Nativas</h3>
            <p className="text-sm text-muted-foreground">
              Google Agenda, Zoom, WhatsApp Business, Mercado Pago e muito mais
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-info" />
            </div>
            <h3 className="text-lg font-semibold">Deploy Instantâneo</h3>
            <p className="text-sm text-muted-foreground">
              Sua página de agendamento no ar em menos de 5 minutos
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Suporte 24/7</h3>
            <p className="text-sm text-muted-foreground">
              Chat ao vivo, tutoriais em vídeo e onboarding personalizado
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}