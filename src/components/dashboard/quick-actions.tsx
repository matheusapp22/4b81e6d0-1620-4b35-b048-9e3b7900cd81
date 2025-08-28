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
      onClick: () => console.log('New appointment')
    },
    {
      title: 'Adicionar Cliente',
      description: 'Cadastrar novo cliente',
      icon: Users,
      color: 'text-neon-blue',
      bgColor: 'bg-blue-500/10',
      onClick: () => console.log('Add client')
    },
    {
      title: 'Ver Calendário',
      description: 'Visualizar agenda completa',
      icon: Calendar,
      color: 'text-neon-green',
      bgColor: 'bg-green-500/10',
      onClick: () => console.log('View calendar')
    },
    {
      title: 'Configurar Horários',
      description: 'Definir horários de trabalho',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-yellow-500/10',
      onClick: () => console.log('Configure hours')
    },
    {
      title: 'Relatórios',
      description: 'Ver relatórios e métricas',
      icon: BarChart3,
      color: 'text-neon-pink',
      bgColor: 'bg-pink-500/10',
      onClick: () => console.log('View reports')
    },
    {
      title: 'Configurações',
      description: 'Ajustar preferências',
      icon: Settings,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/30',
      onClick: () => console.log('Settings')
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
              onClick={action.onClick}
            >
              <div className={`p-3 rounded-lg ${action.bgColor}`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
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