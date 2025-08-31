import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Heart, 
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Mais Tempo Livre",
    description: "Automatize 80% das tarefas administrativas e foque no que realmente importa: seus clientes.",
    metrics: "4h/dia economizadas",
    color: "text-primary",
    bgColor: "bg-primary/10",
    features: [
      "Agendamento automático 24/7",
      "Confirmações e lembretes automáticos",
      "Relatórios gerados automaticamente"
    ]
  },
  {
    icon: Heart,
    title: "Clientes Mais Fidelizados",
    description: "Experiência premium com notificações inteligentes e atendimento personalizado.",
    metrics: "+35% retenção",
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/10",
    features: [
      "Histórico completo do cliente",
      "Campanhas de reativação automáticas",
      "Programa de fidelidade integrado"
    ]
  },
  {
    icon: Briefcase,
    title: "Gestão Profissional",
    description: "Dashboard completo com métricas em tempo real e insights para crescer seu negócio.",
    metrics: "+50% receita média",
    color: "text-success",
    bgColor: "bg-success/10",
    features: [
      "Relatórios financeiros detalhados",
      "Análise de performance por serviço",
      "Predições de demanda com IA"
    ]
  }
];

export function BenefitsSection() {
  return (
    <section className="py-32 bg-gradient-to-b from-surface to-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-pattern opacity-20"></div>
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-tech rounded-full blur-3xl opacity-15 animate-float"></div>
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-gradient-neon rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8 mb-20">
          <Badge className="glass-card bg-primary/10 text-primary border-primary/20 px-6 py-3 text-sm font-bold">
            <Sparkles className="w-4 h-4 mr-2" />
            Resultados Comprovados
          </Badge>
          <h2 className="text-5xl lg:text-6xl font-bold">
            <span className="block text-foreground">Transforme</span>
            <span className="block gradient-text">seu negócio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Mais de 1000 profissionais já experimentaram resultados extraordinários 
            com nossa plataforma inteligente.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="glass-card rounded-3xl p-8 space-y-6 hover:scale-105 transition-all duration-300 group"
            >
              {/* Icon and badge */}
              <div className="flex items-start justify-between">
                <div className={`w-16 h-16 rounded-2xl ${benefit.bgColor} flex items-center justify-center relative group-hover:scale-110 transition-transform`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
                <Badge className={`${benefit.bgColor} ${benefit.color} border-current/30 text-xs font-bold`}>
                  {benefit.metrics}
                </Badge>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
              
              {/* Features */}
              <div className="space-y-3">
                {benefit.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Hover effect indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  <span>Saiba mais</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Success metrics */}
        <div className="glass-card rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Nossos clientes <span className="gradient-text">crescem juntos</span>
            </h3>
            <p className="text-muted-foreground text-lg">
              Resultados médios dos profissionais que usam GoAgendas há mais de 6 meses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingUp,
                value: "+45%",
                label: "Aumento na receita",
                description: "Comparado ao período anterior"
              },
              {
                icon: Users,
                value: "+60%",
                label: "Novos clientes",
                description: "Via agendamento online"
              },
              {
                icon: Clock,
                value: "4.2h",
                label: "Tempo economizado",
                description: "Por dia em tarefas admin"
              },
              {
                icon: Heart,
                value: "98%",
                label: "Satisfação",
                description: "Dos clientes atendidos"
              }
            ].map((metric, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <metric.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="text-4xl font-bold gradient-text mb-2">{metric.value}</div>
                  <div className="font-semibold mb-1">{metric.label}</div>
                  <div className="text-sm text-muted-foreground">{metric.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}