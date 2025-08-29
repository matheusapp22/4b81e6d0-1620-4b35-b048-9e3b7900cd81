import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Bell, CreditCard, BarChart3, Users, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/auth');
  };

  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Content */}
        <div className="space-y-6 md:space-y-8 animate-slide-up text-center lg:text-left">
          <div className="space-y-4">
            <Badge variant="secondary" className="glass-card px-3 md:px-4 py-2 text-sm">
              🚀 Novo: WhatsApp + Pagamentos Automáticos
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="gradient-text">Agendamento</span><br />
              <span className="text-foreground">Inteligente</span><br />
              <span className="text-foreground">para Profissionais</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Automatize agendamentos, receba pagamentos e tenha relatórios em tempo real. 
              A plataforma completa para barbearias, clínicas e consultórios.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              variant="hero" 
              size="hero" 
              className="animate-pulse-glow w-full sm:w-auto"
              onClick={handleStartFree}
            >
              Começar Grátis Agora
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
                  <Play className="w-4 h-4 mr-2" />
                  Ver Demo ao Vivo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Demo ao Vivo - GoAgendas</DialogTitle>
                </DialogHeader>
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <iframe
                    src="/dashboard"
                    className="w-full h-full border-0"
                    title="Demo GoAgendas"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Grátis até 20 agendamentos
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Sem taxa de instalação
            </div>
          </div>
        </div>
        
        {/* Right Side - Dashboard Preview */}
        <div className="relative animate-float order-first lg:order-last">
          <GlassCard variant="neon" className="p-4 md:p-6 space-y-4 md:space-y-6 mx-4 lg:mx-0">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Dashboard</h3>
              <Badge variant="default" className="bg-neon-green">
                ONLINE
              </Badge>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <GlassCard className="p-3 md:p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                  <span className="text-xs md:text-sm text-muted-foreground">Hoje</span>
                </div>
                <div className="text-xl md:text-2xl font-bold">12</div>
                <div className="text-xs md:text-sm text-muted-foreground">agendamentos</div>
              </GlassCard>
              
              <GlassCard className="p-3 md:p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 md:w-5 h-4 md:h-5 text-green-500" />
                  <span className="text-xs md:text-sm text-muted-foreground">Receita</span>
                </div>
                <div className="text-xl md:text-2xl font-bold">R$ 1.240</div>
                <div className="text-xs md:text-sm text-muted-foreground">este mês</div>
              </GlassCard>
            </div>
            
            {/* Recent Appointments */}
            <div className="space-y-3 hidden md:block">
              <h4 className="font-medium text-sm md:text-base">Próximos Agendamentos</h4>
              <div className="space-y-2">
                {[
                  { time: "14:30", client: "João Silva", service: "Corte + Barba" },
                  { time: "15:00", client: "Maria Santos", service: "Manicure" },
                  { time: "16:30", client: "Pedro Costa", service: "Massagem" },
                ].map((appointment, index) => (
                  <GlassCard key={index} className="p-3 flex items-center gap-3">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Clock className="w-5 md:w-6 h-5 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm md:text-base truncate">{appointment.client}</div>
                      <div className="text-xs md:text-sm text-muted-foreground truncate">{appointment.service}</div>
                    </div>
                    <div className="text-xs md:text-sm font-medium">{appointment.time}</div>
                  </GlassCard>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="glass" size="sm" className="flex-col h-12 md:h-16 gap-1 text-xs">
                <Bell className="w-3 md:w-4 h-3 md:h-4" />
                <span className="hidden md:inline text-xs">Notificar</span>
              </Button>
              <Button variant="glass" size="sm" className="flex-col h-12 md:h-16 gap-1 text-xs">
                <BarChart3 className="w-3 md:w-4 h-3 md:h-4" />
                <span className="hidden md:inline text-xs">Relatório</span>
              </Button>
              <Button variant="glass" size="sm" className="flex-col h-12 md:h-16 gap-1 text-xs">
                <Users className="w-3 md:w-4 h-3 md:h-4" />
                <span className="hidden md:inline text-xs">Clientes</span>
              </Button>
            </div>
          </GlassCard>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-12 md:w-16 h-12 md:h-16 bg-gradient-neon rounded-full animate-pulse-glow hidden sm:block"></div>
          <div className="absolute -bottom-4 -left-4 w-8 md:w-12 h-8 md:h-12 bg-green-500/30 rounded-full animate-pulse hidden sm:block"></div>
        </div>
      </div>
    </section>
  );
}