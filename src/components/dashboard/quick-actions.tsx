import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
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
  Crown
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Novo Agendamento',
      description: 'Criar agendamento',
      icon: Plus,
      color: 'text-primary',
      bgColor: 'bg-primary/8',
      href: '/appointments',
      priority: 'high'
    },
    {
      title: 'Adicionar Cliente',
      description: 'Cadastrar cliente',
      icon: Users,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/8',
      href: '/clients',
      priority: 'medium'
    },
    {
      title: 'Ver Agenda',
      description: 'Agenda completa',
      icon: Calendar,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/8',
      href: '/calendar',
      priority: 'medium'
    },
    {
      title: 'Gerenciar Serviços',
      description: 'Configurar serviços',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/8',
      href: '/services',
      priority: 'low'
    },
    {
      title: 'Relatórios',
      description: 'Ver métricas',
      icon: BarChart3,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/8',
      href: '/reports',
      priority: 'medium'
    },
    {
      title: 'Configurações',
      description: 'Ajustar sistema',
      icon: Settings,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      href: '/settings',
      priority: 'low'
    }
  ];

  return (
    <GlassCard variant="premium" className="group">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-headline font-semibold">Ações Rápidas</h3>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center gap-3 hover-glow group/action animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              asChild
            >
              <a href={action.href}>
                <div className={`p-3 rounded-2xl ${action.bgColor} group-hover/action:scale-110 transition-transform duration-300`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold leading-tight">{action.title}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{action.description}</p>
                </div>
              </a>
            </Button>
          ))}
        </div>

        {/* Upgrade Section */}
        <div className="premium-card p-4 bg-gradient-tech group/upgrade">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/20 rounded-xl group-hover/upgrade:scale-110 transition-transform duration-300">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Plano Gratuito</p>
              <p className="text-xs text-muted-foreground">
                Até 20 agendamentos/mês
              </p>
            </div>
          </div>
          
          <Button size="sm" className="w-full group/btn">
            <Zap className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
            Fazer Upgrade
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}