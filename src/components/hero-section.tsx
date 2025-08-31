import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Bell, CreditCard, BarChart3, Users, Play, Sparkles, Zap, Star, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/auth');
  };

  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 md:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 dot-pattern opacity-30"></div>
      <div className="absolute top-32 left-32 w-40 h-40 bg-primary/3 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-32 right-32 w-32 h-32 bg-secondary/3 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-neon-cyan/2 rounded-full blur-xl animate-bounce-subtle"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
        {/* Left Side - Content */}
        <div className="space-y-10 animate-slide-up text-center lg:text-left">
          <div className="space-y-8">
            <Badge variant="secondary" className="glass-card px-6 py-3 text-sm font-semibold border border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Novo: IA + WhatsApp + Pagamentos Automáticos
            </Badge>
            
            <h1 className="text-display leading-none">
              <span className="gradient-text">Agendamento</span><br />
              <span className="text-foreground">Inteligente</span><br />
              <span className="text-foreground">para Profissionais</span>
            </h1>
            
            <p className="text-body text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Automatize agendamentos, receba pagamentos e tenha relatórios em tempo real. 
              A plataforma mais avançada para barbearias, clínicas e consultórios modernos.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <Button 
              variant="hero" 
              size="hero" 
              className="animate-pulse-glow w-full sm:w-auto group shadow-elevated"
              onClick={handleStartFree}
            >
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-400" />
              Começar Grátis Agora
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="glass" size="lg" className="w-full sm:w-auto group shadow-card">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Ver Demo ao Vivo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[90vh] glass-card border-0">
                <DialogHeader>
                  <DialogTitle className="text-title flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Demo ao Vivo - GoAgendas
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-elevated">
                  <iframe
                    src="/dashboard"
                    className="w-full h-full border-0"
                    title="Demo GoAgendas"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-caption">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-card"></div>
              <span className="font-medium">Grátis até 20 agendamentos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse shadow-card"></div>
              <span className="font-medium">Sem taxa de instalação</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-neon-purple rounded-full animate-pulse shadow-card"></div>
              <span className="font-medium">Suporte em português</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Dashboard Preview */}
        <div className="relative animate-float order-first lg:order-last">
          <GlassCard variant="premium" className="p-8 space-y-8 mx-4 lg:mx-0 group shadow-elevated">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-title font-bold">Dashboard Premium</h3>
              <Badge className="status-indicator success px-3 py-2">
                <Activity className="w-3 h-3" />
                ONLINE
              </Badge>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <GlassCard variant="minimal" className="p-6 space-y-4 group/card hover:scale-105 transition-all duration-400">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-caption font-medium">Hoje</span>
                </div>
                <div className="metric-display text-3xl font-bold text-primary">12</div>
                <div className="text-caption">agendamentos</div>
              </GlassCard>
              
              <GlassCard variant="minimal" className="p-6 space-y-4 group/card hover:scale-105 transition-all duration-400">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-success" />
                  <span className="text-caption font-medium">Receita</span>
                </div>
                <div className="metric-display text-3xl font-bold text-success">R$ 1.240</div>
                <div className="text-caption">este mês</div>
              </GlassCard>
            </div>
            
            {/* Recent Appointments */}
            <div className="space-y-6 hidden md:block">
              <h4 className="font-bold text-body">Próximos Agendamentos</h4>
              <div className="space-y-4">
                {[
                  { time: "14:30", client: "João Silva", service: "Corte + Barba", status: "confirmed" },
                  { time: "15:00", client: "Maria Santos", service: "Manicure", status: "scheduled" },
                  { time: "16:30", client: "Pedro Costa", service: "Massagem", status: "confirmed" },
                ].map((appointment, index) => (
                  <GlassCard 
                    key={index} 
                    variant="minimal" 
                    className="p-4 flex items-center gap-4 group/appointment animate-scale-in hover:scale-102 transition-all duration-400"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-14 h-14 bg-gradient-primary rounded-3xl flex items-center justify-center group-hover/appointment:scale-110 transition-all duration-400 shadow-card">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="font-bold text-sm truncate">{appointment.client}</div>
                      <div className="text-caption truncate">{appointment.service}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="metric-display text-lg font-bold">{appointment.time}</div>
                      <Badge className={`status-indicator ${appointment.status === 'confirmed' ? 'success' : 'info'} px-2 py-1`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' : 'Agendado'}
                      </Badge>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <Button variant="minimal" size="sm" className="flex-col h-20 gap-3 group/btn">
                <Bell className="w-5 h-5 group-hover/btn:animate-pulse" />
                <span className="text-micro font-medium">Notificar</span>
              </Button>
              <Button variant="minimal" size="sm" className="flex-col h-20 gap-3 group/btn">
                <BarChart3 className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                <span className="text-micro font-medium">Relatório</span>
              </Button>
              <Button variant="minimal" size="sm" className="flex-col h-20 gap-3 group/btn">
                <Users className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                <span className="text-micro font-medium">Clientes</span>
              </Button>
            </div>

            {/* Rating Section */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-caption font-bold">5.0 • Excelente</span>
            </div>
          </GlassCard>
          
          {/* Floating Elements */}
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-neon rounded-full animate-pulse-glow opacity-40 hidden sm:block"></div>
          <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-success/20 rounded-full animate-pulse opacity-60 hidden sm:block"></div>
        </div>
      </div>
    </section>
  );
}