import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3,
  MessageSquare,
  Clock,
  CreditCard
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Novo Agendamento',
      description: 'Criar um novo agendamento',
      icon: Plus,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: '/appointments'
    },
    {
      title: 'Adicionar Cliente',
      description: 'Cadastrar novo cliente',
      icon: Users,
      color: 'text-neon-blue',
      bgColor: 'bg-blue-500/10',
      href: '/clients'
    },
    {
      title: 'Ver Agendamentos',
      description: 'Visualizar agenda completa',
      icon: Calendar,
      color: 'text-neon-green',
      bgColor: 'bg-green-500/10',
      href: '/appointments'
    },
    {
      title: 'Gerenciar Serviços',
      description: 'Configurar seus serviços',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-yellow-500/10',
      href: '/services'
    },
    {
      title: 'Horários',
      description: 'Configurar horários de trabalho',
      icon: BarChart3,
      color: 'text-neon-pink',
      bgColor: 'bg-pink-500/10',
      href: '/settings'
    },
    {
      title: 'Configurações',
      description: 'Ajustar preferências',
      icon: Settings,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/30',
      href: '/settings'
    }
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center gap-2 hover-glow"
              asChild
            >
              <a href={action.href}>
                <div className={`p-3 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </a>
            </Button>
          ))}
        </div>

        {/* Upgrade Section */}
        <div className="mt-6 p-4 border rounded-lg bg-gradient-hero">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Plano Gratuito</p>
              <p className="text-xs text-muted-foreground">
                Até 20 agendamentos/mês
              </p>
            </div>
          </div>
          
          <Button size="sm" className="w-full">
            Fazer Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}