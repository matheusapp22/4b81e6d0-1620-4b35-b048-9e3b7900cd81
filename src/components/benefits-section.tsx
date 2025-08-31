import { GlassCard } from '@/components/ui/glass-card';
import { Clock, Heart, TrendingUp, Shield, Sparkles, Target } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Mais Tempo Livre',
    description: 'Automatize tarefas repetitivas e ganhe horas preciosas para focar no que realmente importa: seus clientes.',
    color: 'from-primary to-neon-blue',
    stats: '+5h/dia economizadas'
  },
  {
    icon: Heart,
    title: 'Clientes Mais Felizes',
    description: 'Experiência de agendamento fluida, confirmações automáticas e atendimento personalizado.',
    color: 'from-neon-pink to-neon-purple',
    stats: '98% satisfação'
  },
  {
    icon: TrendingUp,
    title: 'Crescimento Acelerado',
    description: 'Insights inteligentes e ferramentas de marketing para aumentar sua receita e expandir seu negócio.',
    color: 'from-success to-neon-green',
    stats: '+40% receita média'
  }
];

const useCases = [
  {
    type: 'Salões de Beleza',
    description: 'Gerencie cortes, colorações e tratamentos com agenda otimizada',
    image: '💇‍♀️'
  },
  {
    type: 'Clínicas Médicas',
    description: 'Prontuários digitais e agendamento de consultas especializado',
    image: '🏥'
  },
  {
    type: 'Consultórios',
    description: 'Atendimento profissional com gestão completa de pacientes',
    image: '👨‍⚕️'
  },
  {
    type: 'Estéticas',
    description: 'Procedimentos estéticos com controle total de sessões',
    image: '✨'
  },
  {
    type: 'Barbearins',
    description: 'Cortes masculinos e serviços de barbearia modernos',
    image: '💈'
  },
  {
    type: 'Personal Trainers',
    description: 'Treinos personalizados com acompanhamento individual',
    image: '💪'
  }
];

export const BenefitsSection = () => {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-10 w-72 h-72 bg-gradient-cosmic opacity-10 rounded-full blur-3xl animate-cosmic-drift"></div>
        <div className="absolute bottom-32 right-10 w-64 h-64 bg-gradient-primary opacity-15 rounded-full blur-2xl animate-pulse-glow"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Benefits section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
            <Target className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Resultados Reais</span>
          </div>
          
          <h2 className="text-hero">
            Transforme seu negócio com{' '}
            <span className="bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
              resultados comprovados
            </span>
          </h2>
          
          <p className="text-subtitle text-muted-foreground">
            Mais de 2.000 empresas já transformaram sua gestão com o GoAgendas
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {benefits.map((benefit, index) => (
            <GlassCard 
              key={index} 
              variant="premium" 
              className="p-8 text-center space-y-6 hover-glow group transition-all duration-500"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${benefit.color} p-4 shadow-premium group-hover:scale-110 transition-transform duration-500`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-title">{benefit.title}</h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
                
                <div className="glass-card px-4 py-2 rounded-full inline-block">
                  <span className="text-sm font-semibold text-primary">{benefit.stats}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Use cases section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Casos de Uso</span>
            </div>
            
            <h3 className="text-title">
              Ideal para qualquer negócio baseado em{' '}
              <span className="bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
                agendamentos
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <GlassCard 
                key={index} 
                variant="minimal" 
                className="p-6 space-y-4 hover-scale group cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {useCase.image}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{useCase.type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Testimonial preview */}
        <div className="mt-20">
          <GlassCard variant="premium" className="p-8 lg:p-12 text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl">⭐</div>
              <blockquote className="text-subtitle italic text-muted-foreground max-w-2xl mx-auto">
                "O GoAgendas transformou completamente a forma como gerencio meu salão. 
                Economizo pelo menos 3 horas por dia e meus clientes adoram a facilidade de agendamento."
              </blockquote>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold">Maria Silva</p>
              <p className="text-sm text-muted-foreground">Proprietária do Salão Bella Vista</p>
            </div>

            <div className="flex items-center justify-center gap-8 pt-6 border-t border-border/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">150+</p>
                <p className="text-xs text-muted-foreground">Agendamentos/mês</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">+60%</p>
                <p className="text-xs text-muted-foreground">Aumento na receita</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-purple">99%</p>
                <p className="text-xs text-muted-foreground">Satisfação clientes</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};