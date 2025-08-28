import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Bell, CreditCard, BarChart3, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-4">
            <Badge variant="secondary" className="glass-card px-4 py-2">
              🚀 Novo: WhatsApp + Pagamentos Automáticos
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="gradient-text">Agendamento</span><br />
              <span className="text-foreground">Inteligente</span><br />
              <span className="text-foreground">para Profissionais</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Automatize agendamentos, receba pagamentos e tenha relatórios em tempo real. 
              A plataforma completa para barbearias, clínicas e consultórios.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="hero" className="animate-pulse-glow">
              Começar Grátis Agora
            </Button>
            <Button variant="glass" size="lg">
              Ver Demo ao Vivo
            </Button>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              Grátis até 20 agendamentos
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
              Sem taxa de instalação
            </div>
          </div>
        </div>
        
        {/* Right Side - Dashboard Preview */}
        <div className="relative animate-float">
          <GlassCard variant="neon" className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Dashboard</h3>
              <Badge variant="default" className="bg-neon-green">
                ONLINE
              </Badge>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <GlassCard className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Hoje</span>
                </div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">agendamentos</div>
              </GlassCard>
              
              <GlassCard className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neon-green" />
                  <span className="text-sm text-muted-foreground">Receita</span>
                </div>
                <div className="text-2xl font-bold">R$ 1.240</div>
                <div className="text-sm text-muted-foreground">este mês</div>
              </GlassCard>
            </div>
            
            {/* Recent Appointments */}
            <div className="space-y-3">
              <h4 className="font-medium">Próximos Agendamentos</h4>
              <div className="space-y-2">
                {[
                  { time: "14:30", client: "João Silva", service: "Corte + Barba" },
                  { time: "15:00", client: "Maria Santos", service: "Manicure" },
                  { time: "16:30", client: "Pedro Costa", service: "Massagem" },
                ].map((appointment, index) => (
                  <GlassCard key={index} className="p-3 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{appointment.client}</div>
                      <div className="text-sm text-muted-foreground">{appointment.service}</div>
                    </div>
                    <div className="text-sm font-medium">{appointment.time}</div>
                  </GlassCard>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="glass" size="sm" className="flex-col h-16 gap-1">
                <Bell className="w-4 h-4" />
                <span className="text-xs">Notificar</span>
              </Button>
              <Button variant="glass" size="sm" className="flex-col h-16 gap-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs">Relatório</span>
              </Button>
              <Button variant="glass" size="sm" className="flex-col h-16 gap-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">Clientes</span>
              </Button>
            </div>
          </GlassCard>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-neon rounded-full animate-pulse-glow"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-neon-green/30 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}