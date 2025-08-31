import { Check, Star, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useNavigate } from 'react-router-dom';

export const PricingSection = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/auth');
  };

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-cosmic opacity-10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-primary opacity-15 rounded-full blur-2xl animate-cosmic-drift"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
            <Star className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Planos Simples</span>
          </div>
          
          <h2 className="text-hero">
            Comece gratuitamente,{' '}
            <span className="bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
              evolua quando precisar
            </span>
          </h2>
          
          <p className="text-subtitle text-muted-foreground">
            Sem surpresas, sem taxas ocultas. Apenas o que você precisa para crescer.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free plan */}
          <GlassCard variant="premium" className="p-8 space-y-8 relative overflow-hidden">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-title">Gratuito</h3>
                <p className="text-muted-foreground">Perfeito para começar</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">Para sempre, sem prazo de validade</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Inclui:</h4>
              <div className="space-y-3">
                {[
                  'Até 50 clientes',
                  'Agendamentos ilimitados',
                  'Calendário inteligente',
                  'Notificações automáticas',
                  'Relatórios básicos',
                  'Suporte por email'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleStartFree}
              variant="outline" 
              size="lg" 
              className="w-full glass-card border-primary/30 hover:border-primary/50 hover:bg-primary/5 py-6"
            >
              Começar Gratuitamente
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </GlassCard>

          {/* Pro plan */}
          <GlassCard variant="neon" className="p-8 space-y-8 relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <div className="bg-gradient-primary px-6 py-2 rounded-full text-sm font-semibold text-white shadow-glow">
                <Zap className="w-4 h-4 inline mr-1" />
                Mais Popular
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-title">Profissional</h3>
                <p className="text-muted-foreground">Para negócios em crescimento</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
                    R$ 49
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="line-through text-muted-foreground/60">R$ 69/mês</span> 
                  <span className="text-success font-medium ml-2">30% OFF no primeiro ano</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Tudo do Gratuito, mais:</h4>
              <div className="space-y-3">
                {[
                  'Clientes ilimitados',
                  'Gestão de equipe completa',
                  'Relatórios avançados',
                  'Integração com pagamentos',
                  'App mobile dedicado',
                  'Suporte prioritário',
                  'Backup automático',
                  'Personalização da marca'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleStartFree}
              size="lg" 
              className="w-full bg-gradient-primary hover:scale-105 transition-all duration-500 shadow-premium hover:shadow-glow py-6 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Começar Teste Gratuito
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              14 dias grátis • Cancele quando quiser • Sem taxa de setup
            </p>
          </GlassCard>
        </div>

        {/* Features comparison */}
        <div className="mt-20 max-w-4xl mx-auto">
          <GlassCard variant="minimal" className="p-8">
            <div className="text-center space-y-4 mb-8">
              <h3 className="text-title">Comparação Completa</h3>
              <p className="text-muted-foreground">Veja tudo que está incluído em cada plano</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/20">
                    <th className="text-left py-4 font-semibold">Funcionalidade</th>
                    <th className="text-center py-4 font-semibold">Gratuito</th>
                    <th className="text-center py-4 font-semibold">Profissional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {[
                    { feature: 'Número de clientes', free: '50', pro: 'Ilimitado' },
                    { feature: 'Agendamentos', free: 'Ilimitado', pro: 'Ilimitado' },
                    { feature: 'Usuários/funcionários', free: '1', pro: 'Ilimitado' },
                    { feature: 'Relatórios', free: 'Básicos', pro: 'Avançados' },
                    { feature: 'Suporte', free: 'Email', pro: 'Prioritário' },
                    { feature: 'App mobile', free: '❌', pro: '✅' },
                    { feature: 'Integração pagamentos', free: '❌', pro: '✅' },
                    { feature: 'Personalização marca', free: '❌', pro: '✅' }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-muted/5">
                      <td className="py-4 font-medium">{row.feature}</td>
                      <td className="py-4 text-center text-muted-foreground">{row.free}</td>
                      <td className="py-4 text-center text-primary font-semibold">{row.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* FAQ preview */}
        <div className="mt-20 text-center space-y-6">
          <h3 className="text-title">Dúvidas?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos 14 dias de teste gratuito em todos os planos pagos. 
            Cancele quando quiser, sem taxas ou compromissos.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-card px-4 py-2 rounded-full">
              <span className="text-sm text-muted-foreground">✅ Sem taxa de setup</span>
            </div>
            <div className="glass-card px-4 py-2 rounded-full">
              <span className="text-sm text-muted-foreground">✅ Cancele quando quiser</span>
            </div>
            <div className="glass-card px-4 py-2 rounded-full">
              <span className="text-sm text-muted-foreground">✅ Suporte incluído</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};