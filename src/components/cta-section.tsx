import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CtaSection = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/auth');
  };

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-neon-purple/5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-cosmic opacity-20 rounded-full blur-3xl animate-cosmic-drift"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-primary opacity-30 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-neon-blue to-neon-purple opacity-25 rounded-full blur-2xl animate-cosmic-drift"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>

      <div className="relative container mx-auto px-4">
        <GlassCard variant="premium" className="max-w-4xl mx-auto p-12 lg:p-16 text-center space-y-12 shadow-premium">
          {/* Header */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
                Transforme Sua Empresa Hoje
              </span>
              <Zap className="w-5 h-5 text-neon-blue animate-pulse" />
            </div>

            <h2 className="text-hero leading-tight">
              Pronto para{' '}
              <span className="bg-gradient-to-r from-primary via-neon-blue to-neon-purple bg-clip-text text-transparent">
                revolucionar
              </span>{' '}
              seu negócio?
            </h2>

            <p className="text-subtitle text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Junte-se a mais de 2.000 empresas que já transformaram 
              sua gestão com o GoAgendas. Comece gratuitamente hoje mesmo.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '2.000+', label: 'Empresas confiam' },
              { value: '50k+', label: 'Agendamentos/mês' },
              { value: '4.9/5', label: 'Avaliação média' }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={handleStartFree}
              size="lg" 
              className="bg-gradient-primary hover:scale-105 transition-all duration-500 shadow-premium hover:shadow-glow px-12 py-8 text-xl font-semibold rounded-2xl group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Experimente Gratuitamente
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Button>
            
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                Setup em 2 minutos
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                Suporte brasileiro
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 border-t border-border/20">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success"></div>
                <span>SSL Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary"></div>
                <span>LGPD Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-neon-purple"></div>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-neon-blue"></div>
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};