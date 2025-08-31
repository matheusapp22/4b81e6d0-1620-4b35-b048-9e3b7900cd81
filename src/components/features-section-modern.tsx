import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  Clock, 
  Shield,
  Smartphone,
  Zap,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    id: 'scheduling',
    icon: Calendar,
    title: 'Agendamentos',
    subtitle: 'Rápidos e Fáceis',
    description: 'Sistema intuitivo de agendamento com calendário visual, confirmações automáticas e gestão de disponibilidade em tempo real.',
    benefits: ['Calendário visual intuitivo', 'Confirmações automáticas', 'Gestão de horários', 'Reagendamento fácil'],
    color: 'from-primary to-neon-blue'
  },
  {
    id: 'clients',
    icon: Users,
    title: 'Clientes',
    subtitle: 'Base Organizada',
    description: 'Mantenha todos os dados dos seus clientes organizados com histórico completo, preferências e comunicação centralizada.',
    benefits: ['Histórico completo', 'Preferências salvas', 'Comunicação integrada', 'Segmentação avançada'],
    color: 'from-neon-purple to-neon-pink'
  },
  {
    id: 'team',
    icon: Shield,
    title: 'Equipe',
    subtitle: 'Gestão Inteligente',
    description: 'Gerencie sua equipe com controle de acesso, agendas individuais e relatórios de performance personalizados.',
    benefits: ['Controle de acesso', 'Agendas individuais', 'Relatórios de performance', 'Gestão de comissões'],
    color: 'from-neon-green to-primary'
  },
  {
    id: 'financial',
    icon: DollarSign,
    title: 'Financeiro',
    subtitle: 'Controle Total',
    description: 'Acompanhe receitas, despesas e lucros com relatórios automáticos e integração com métodos de pagamento.',
    benefits: ['Controle de receitas', 'Gestão de despesas', 'Relatórios automáticos', 'Integração pagamentos'],
    color: 'from-success to-neon-green'
  },
  {
    id: 'reports',
    icon: BarChart3,
    title: 'Relatórios',
    subtitle: 'Insights e Métricas',
    description: 'Dashboards inteligentes com métricas em tempo real, análises de tendências e insights para crescimento.',
    benefits: ['Métricas em tempo real', 'Análise de tendências', 'Insights de crescimento', 'Exportação de dados'],
    color: 'from-warning to-neon-pink'
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile',
    subtitle: 'Acesso em Qualquer Lugar',
    description: 'Aplicativo responsivo que funciona perfeitamente em qualquer dispositivo, mantendo você sempre conectado.',
    benefits: ['100% responsivo', 'Offline primeiro', 'Notificações push', 'Sincronização automática'],
    color: 'from-info to-neon-blue'
  }
];

export const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  
  const active = features.find(f => f.id === activeFeature) || features[0];

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-cosmic opacity-10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-primary opacity-15 rounded-full blur-2xl animate-cosmic-drift"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Funcionalidades Principais</span>
          </div>
          
          <h2 className="text-hero">
            Tudo que você precisa em{' '}
            <span className="bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
              uma plataforma
            </span>
          </h2>
          
          <p className="text-subtitle text-muted-foreground">
            Simplifique sua gestão com ferramentas inteligentes e intuitivas
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <GlassCard
              key={feature.id}
              variant={activeFeature === feature.id ? "neon" : "default"}
              className={`p-6 cursor-pointer transition-all duration-500 hover-glow ${
                activeFeature === feature.id ? 'scale-105 shadow-premium' : 'hover:scale-102'
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-3 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.subtitle}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Saiba mais</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${
                    activeFeature === feature.id ? 'translate-x-1 text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Feature detail */}
        <GlassCard variant="premium" className="p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${active.color} p-4 shadow-premium`}>
                  <active.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-title">{active.title}</h3>
                  <p className="text-lg text-muted-foreground">{active.subtitle}</p>
                </div>
                
                <p className="text-body text-muted-foreground leading-relaxed">
                  {active.description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Principais benefícios:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {active.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="bg-gradient-primary hover:scale-105 transition-all duration-300">
                Experimentar Agora
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Visual representation */}
            <div className="relative">
              <GlassCard variant="minimal" className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{active.title} - Demo</h4>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-destructive"></div>
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                  </div>
                </div>

                {/* Mock interface */}
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border/20">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${active.color} animate-pulse`}></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-muted rounded animate-pulse"></div>
                        <div className="h-2 bg-muted/50 rounded w-2/3 animate-pulse"></div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-success font-medium">● Ativo</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};