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
    <section className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-6 md:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-info/5 rounded-full blur-2xl animate-pulse-glow"></div>
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-primary/3 rounded-full blur-xl animate-bounce-subtle"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-info/60 rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-success/30 rounded-full animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
        <div className="absolute bottom-20 right-10 w-1.5 h-1.5 bg-primary/50 rounded-full animate-float" style={{ animationDelay: '3s', animationDuration: '4.5s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
        {/* Left Side - Content */}
        <div className="space-y-10 text-center lg:text-left">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 animate-slide-up hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              Novo: IA + WhatsApp + Pagamentos
            </div>
            
            <h1 className="text-display animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <span className="block text-foreground">Agendamento</span>
              <span className="block gradient-text animate-pulse-glow">Inteligente</span>
              <span className="block text-foreground">para Profissionais</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Automatize agendamentos, receba pagamentos e tenha relatórios em tempo real.
              A plataforma mais avançada para seu negócio.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-lg font-medium shadow-sm group hover:scale-105 transition-all duration-300 hover:shadow-neon"
              onClick={handleStartFree}
            >
              Começar Grátis
              <Zap className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium group hover:scale-105 transition-all duration-300 hover:border-primary/50">
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Ver Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Demo - GoAgendas
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full h-full rounded-lg overflow-hidden border border-border">
                  <iframe
                    src="/dashboard"
                    className="w-full h-full border-0"
                    title="Demo GoAgendas"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Grátis até 20 agendamentos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Sem taxa de instalação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Dashboard Preview */}
        <div className="relative order-first lg:order-last animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-card border border-border rounded-2xl p-8 space-y-8 shadow-elevated hover:shadow-premium transition-all duration-500 group hover:scale-[1.02]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Dashboard</h3>
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-full text-xs font-medium border border-success/20">
                <Activity className="w-3 h-3" />
                Online
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-secondary rounded-xl p-6 space-y-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Hoje</span>
                </div>
                <div className="text-3xl font-bold text-foreground">12</div>
                <div className="text-sm text-muted-foreground">agendamentos</div>
              </div>
              
              <div className="bg-secondary rounded-xl p-6 space-y-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-success" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Receita</span>
                </div>
                <div className="text-3xl font-bold text-foreground">R$ 1.240</div>
                <div className="text-sm text-muted-foreground">este mês</div>
              </div>
            </div>
            
            {/* Recent Appointments */}
            <div className="space-y-6 hidden md:block">
              <h4 className="font-semibold text-foreground">Próximos Agendamentos</h4>
              <div className="space-y-4">
                {[
                  { time: "14:30", client: "João Silva", service: "Corte + Barba", status: "confirmed" },
                  { time: "15:00", client: "Maria Santos", service: "Manicure", status: "scheduled" },
                  { time: "16:30", client: "Pedro Costa", service: "Massagem", status: "confirmed" },
                ].map((appointment, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">{appointment.client}</div>
                      <div className="text-xs text-muted-foreground truncate">{appointment.service}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm font-semibold text-foreground">{appointment.time}</div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        appointment.status === 'confirmed' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-info/10 text-info border-info/20'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' : 'Agendado'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" size="sm" className="flex-col h-20 gap-2 p-4 group hover:scale-105 transition-all duration-300 hover:border-primary/50">
                <Bell className="w-5 h-5 group-hover:animate-bounce" />
                <span className="text-xs font-medium">Notificar</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-20 gap-2 p-4 group hover:scale-105 transition-all duration-300 hover:border-primary/50">
                <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-medium">Relatório</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-20 gap-2 p-4 group hover:scale-105 transition-all duration-300 hover:border-primary/50">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-medium">Clientes</span>
              </Button>
            </div>

            {/* Rating Section */}
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-border">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">5.0 • Excelente</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}