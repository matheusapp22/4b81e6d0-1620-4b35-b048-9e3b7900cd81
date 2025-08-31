import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3,
  MessageSquare,
  Clock,
  CreditCard,
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  Star
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Novo Agendamento',
      description: 'Criar agendamento',
      icon: Plus,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: '/appointments',
      priority: 'high',
      variant: 'futuristic' as const
    },
    {
      title: 'Adicionar Cliente',
      description: 'Cadastrar cliente',
      icon: Users,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/10',
      href: '/clients',
      priority: 'medium',
      variant: 'elegant' as const
    },
    {
      title: 'Ver Agenda',
      description: 'Agenda completa',
      icon: Calendar,
      color: 'text-success',
      bgColor: 'bg-success/10',
      href: '/calendar',
      priority: 'medium',
      variant: 'elegant' as const
    },
    {
      title: 'Gerenciar Serviços',
      description: 'Configurar serviços',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      href: '/services',
      priority: 'low',
      variant: 'minimal' as const
    },
    {
      title: 'Relatórios',
      description: 'Ver métricas',
      icon: BarChart3,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
      href: '/reports',
      priority: 'medium',
      variant: 'elegant' as const
    },
    {
      title: 'Configurações',
      description: 'Ajustar sistema',
      icon: Settings,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      href: '/settings',
      priority: 'low',
      variant: 'minimal' as const
    }
  ];

  return (
    <GlassCard variant="premium" className="group">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-400 shadow-card">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-title font-bold">Ações Rápidas</h3>
            <Badge className="status-indicator info px-3 py-1">
              <Sparkles className="w-3 h-3" />
              6 ações
            </Badge>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              variant={action.variant}
              className="h-auto p-6 flex flex-col items-center gap-4 hover-glow group/action animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              asChild
            >
              <Link to={action.href}>
                <div className={`p-4 rounded-3xl ${action.bgColor} group-hover/action:scale-110 transition-all duration-400 shadow-card group-hover/action:rotate-6`}>
                  <action.icon className={`w-6 h-6 ${action.color} group-hover/action:scale-110 transition-transform duration-300`} />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold leading-tight">{action.title}</p>
                  <p className="text-micro text-muted-foreground leading-tight">{action.description}</p>
                </div>
              </Link>
            </Button>
          ))}
        </div>

        {/* Upgrade Section */}
        <div className="premium-card p-6 bg-gradient-tech group/upgrade relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary rounded-full opacity-5 animate-float"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/20 rounded-2xl group-hover/upgrade:scale-110 transition-all duration-400 shadow-card">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-body">Plano Gratuito</p>
                  <Badge className="status-indicator success px-2 py-1">
                    <Star className="w-3 h-3" />
                    Ativo
                  </Badge>
                </div>
                <p className="text-caption text-muted-foreground">
                  Até 20 agendamentos por mês
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-micro font-medium">Uso mensal</span>
                <span className="text-micro font-bold">8/20</span>
              </div>
              <div className="progress-premium" style={{ '--progress-width': '40%' } as React.CSSProperties}>
                <div className="h-full bg-gradient-primary rounded-full transition-all duration-1000" style={{ width: '40%' }}></div>
              </div>
            </div>
            
            <Button size="default" className="w-full group/btn" variant="futuristic">
              <Zap className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
              Fazer Upgrade Pro
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}