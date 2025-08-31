import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Bell, CreditCard, BarChart3, Users, Play, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/auth');
  };

  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 md:px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 matrix-pattern opacity-20"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Side - Content */}
        <div className="space-y-8 animate-slide-up text-center lg:text-left">
          <div className="space-y-6">
            <Badge variant="secondary" className="glass-card px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Novo: WhatsApp + Pagamentos Automáticos
            </Badge>
            
            <h1 className="text-display leading-none">
              <span className="gradient-text">Agendamento</span><br />
              <span className="text-foreground">Inteligente</span><br />
              <span className="text-foreground">para Profissionais</span>
            </h1>
            
            <p className="text-body text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Automatize agendamentos, receba pagamentos e tenha relatórios em tempo real. 
              A plataforma completa para barbearias, clínicas e consultórios.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              variant="hero" 
              size="hero" 
              className="animate-pulse-glow w-full sm:w-auto group"
              onClick={handleStartFree}
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Começar Grátis Agora
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="glass" size="lg" className="w-full sm:w-auto group">
                  <Play className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Ver Demo ao Vivo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl h-[85vh] glass-card border-0">
                <DialogHeader>
                  <DialogTitle className="text-headline">Demo ao Vivo - GoAgendas</DialogTitle>
                </DialogHeader>
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <iframe
                    src="/dashboard"
                    className="w-full h-full border-0"
                    title="Demo GoAgendas"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-caption">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span>Grátis até 20 agendamentos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
              <span>Sem taxa de instalação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Dashboard Preview */}
        <div className="relative animate-float order-first lg:order-last">
          <GlassCard variant="premium" className="p-6 space-y-6 mx-4 lg:mx-0 group">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-headline font-semibold">Dashboard</h3>
              <Badge variant="default" className="status-badge success">
                <Activity className="w-3 h-3" />
                ONLINE
              </Badge>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <GlassCard variant="minimal" className="p-4 space-y-3 group/card">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-caption">Hoje</span>
                </div>
                <div className="metric-display text-2xl">12</div>
                <div className="text-caption">agendamentos</div>
              </GlassCard>
              
              <GlassCard variant="minimal" className="p-4 space-y-3 group/card">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-neon-green" />
                  <span className="text-caption">Receita</span>
                </div>
                <div className="metric-display text-2xl">R$ 1.240</div>
                <div className="text-caption">este mês</div>
              </GlassCard>
            </div>
            
            {/* Recent Appointments */}
            <div className="space-y-4 hidden md:block">
              <h4 className="font-semibold text-body">Próximos Agendamentos</h4>
              <div className="space-y-3">
                {[
                  { time: "14:30", client: "João Silva", service: "Corte + Barba" },
                  { time: "15:00", client: "Maria Santos", service: "Manicure" },
                  { time: "16:30", client: "Pedro Costa", service: "Massagem" },
                ].map((appointment, index) => (
                  <GlassCard 
                    key={index} 
                    variant="minimal" 
                    className="p-3 flex items-center gap-3 group/appointment animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover/appointment:scale-110 transition-transform duration-300">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="font-semibold text-sm truncate">{appointment.client}</div>
                      <div className="text-caption truncate">{appointment.service}</div>
                    </div>
                    <div className="metric-display text-sm font-bold">{appointment.time}</div>
                  </GlassCard>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button variant="minimal" size="sm" className="flex-col h-16 gap-2 group/btn">
                <Bell className="w-4 h-4 group-hover/btn:animate-pulse" />
                <span className="text-xs">Notificar</span>
              </Button>
              <Button variant="minimal" size="sm" className="flex-col h-16 gap-2 group/btn">
                <BarChart3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                <span className="text-xs">Relatório</span>
              </Button>
              <Button variant="minimal" size="sm" className="flex-col h-16 gap-2 group/btn">
                <Users className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                <span className="text-xs">Clientes</span>
              </Button>
            </div>
          </GlassCard>
          
          {/* Floating Elements */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-neon rounded-full animate-pulse-glow opacity-60 hidden sm:block"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-neon-green/30 rounded-full animate-pulse opacity-40 hidden sm:block"></div>
        </div>
      </div>
    </section>
  );
}