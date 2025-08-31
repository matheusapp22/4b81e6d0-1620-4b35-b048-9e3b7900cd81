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
  Bot,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Calendar,
    title: "Agendamentos Inteligentes",
    description: "Página personalizada com IA que aprende os hábitos dos seus clientes",
    badge: "IA INTEGRADA",
    color: "text-primary",
    bgColor: "bg-primary/10",
    details: [
      "Agendamento 24/7 automatizado",
      "Sugestões inteligentes de horários",
      "Integração com Google Agenda",
      "Bloqueio automático de conflitos"
    ]
  },
  {
    icon: Bell,
    title: "Notificações Automáticas",
    description: "WhatsApp, email e push notifications com timing perfeito",
    badge: "MULTI-CANAL",
    color: "text-neon-blue",
    bgColor: "bg-neon-blue/10",
    details: [
      "WhatsApp Business API",
      "Templates personalizáveis",
      "Lembretes automáticos",
      "Confirmação inteligente"
    ]
  },
  {
    icon: CreditCard,
    title: "Pagamentos Integrados",
    description: "Pix, cartão e parcelamento com checkout transparente",
    badge: "SEGURO",
    color: "text-success",
    bgColor: "bg-success/10",
    details: [
      "Pix instantâneo",
      "Cartão com parcelamento",
      "Checkout transparente",
      "Reconciliação automática"
    ]
  },
  {
    icon: BarChart3,
    title: "Analytics Avançados",
    description: "Insights em tempo real com predições de IA",
    badge: "PREDITIVO",
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/10",
    details: [
      "Dashboard em tempo real",
      "Predições de demanda",
      "ROI por serviço",
      "Análise de tendências"
    ]
  },
  {
    icon: Users,
    title: "CRM Inteligente",
    description: "Histórico completo com automações personalizadas",
    badge: "AUTOMATIZADO",
    color: "text-primary",
    bgColor: "bg-primary/10",
    details: [
      "Perfil 360º do cliente",
      "Campanhas automáticas",
      "Segmentação inteligente",
      "Lifecycle personalizado"
    ]
  },
  {
    icon: Bot,
    title: "Assistente com IA",
    description: "Chatbot inteligente que resolve 80% das dúvidas",
    badge: "GPT-4",
    color: "text-neon-blue",
    bgColor: "bg-neon-blue/10",
    details: [
      "Atendimento 24/7",
      "Agendamento por voz",
      "Respostas contextuais",
      "Escalação inteligente"
    ]
  }
];

export function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-32 bg-gradient-to-b from-background to-surface relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 tech-grid opacity-5"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-neon rounded-full blur-3xl opacity-10 animate-float"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8 mb-20">
          <Badge className="glass-card bg-primary/10 text-primary border-primary/20 px-6 py-3 text-sm font-bold">
            <Sparkles className="w-4 h-4 mr-2" />
            Tecnologia de Ponta
          </Badge>
          <h2 className="text-5xl lg:text-6xl font-bold">
            <span className="block text-foreground">Funcionalidades que</span>
            <span className="block gradient-text">transformam negócios</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Cada recurso foi pensado para automatizar processos e aumentar sua receita
            usando inteligência artificial e automações avançadas.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  activeFeature === index ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center relative`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      {activeFeature === index && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-20 animate-pulse"></div>
                      )}
                    </div>
                    <Badge className={`${feature.bgColor} ${feature.color} border-current/30 text-xs`}>
                      {feature.badge}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {activeFeature === index && (
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      <span>Ver detalhes</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Feature Details */}
          <div className="lg:sticky lg:top-24">
            <div className="glass-card rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${features[activeFeature].bgColor} flex items-center justify-center`}>
                  <features[activeFeature].icon className={`w-8 h-8 ${features[activeFeature].color}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
                  <p className="text-muted-foreground">{features[activeFeature].description}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Recursos inclusos:</h4>
                <div className="space-y-3">
                  {features[activeFeature].details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Visual indicator */}
              <div className="mt-6 p-4 bg-gradient-primary/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Recurso disponível no plano Pro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}