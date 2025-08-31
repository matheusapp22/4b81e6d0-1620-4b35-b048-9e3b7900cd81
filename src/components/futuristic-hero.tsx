import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Calendar,
  Users,
  TrendingUp,
  Zap,
  Bot,
  Shield
} from "lucide-react";
import { useState } from "react";

export function FuturisticHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center cosmic-bg overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 tech-grid opacity-20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-neon rounded-full blur-3xl opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-tech rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-tech-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <Badge className="glass-card bg-primary/10 text-primary border-primary/20 px-6 py-3 text-sm font-bold mx-auto lg:mx-0 w-fit">
              <Sparkles className="w-4 h-4 mr-2" />
              Futuro dos Agendamentos
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-foreground">Agendamentos</span>
                <span className="block gradient-text">inteligentes</span>
                <span className="block text-foreground text-4xl lg:text-5xl font-medium">
                  para negócios modernos
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                O GoAgendas é a plataforma completa para gestão de clientes, 
                agendamentos, equipe e financeiro com inteligência artificial integrada.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Button 
                size="xl" 
                className="group bg-gradient-primary hover:shadow-glow transition-all duration-300"
                asChild
              >
                <a href="/auth">
                  Criar Conta Gratuita
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="xl" 
                className="glass-card border-white/20 hover:bg-white/5"
                onClick={() => setIsVideoOpen(true)}
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 items-center justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Teste 7 dias grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                <span>Setup em 5 minutos</span>
              </div>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="relative">
            <div className="glass-hero rounded-3xl p-8 relative">
              {/* Mock dashboard */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">GoAgendas</h3>
                      <p className="text-sm text-muted-foreground">Dashboard</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Hoje</span>
                    </div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-success">+24%</div>
                  </div>
                  <div className="glass-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-neon-blue" />
                      <span className="text-xs text-muted-foreground">Receita</span>
                    </div>
                    <div className="text-2xl font-bold">R$ 2.8k</div>
                    <div className="text-xs text-success">+18%</div>
                  </div>
                  <div className="glass-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neon-purple" />
                      <span className="text-xs text-muted-foreground">Clientes</span>
                    </div>
                    <div className="text-2xl font-bold">147</div>
                    <div className="text-xs text-success">+12%</div>
                  </div>
                </div>
                
                {/* Next appointments */}
                <div className="glass-card p-4 rounded-xl space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Próximos Agendamentos
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: "Maria Silva", service: "Corte + Escova", time: "14:30" },
                      { name: "João Santos", service: "Barba", time: "15:00" },
                      { name: "Ana Costa", service: "Manicure", time: "15:30" }
                    ].map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {appointment.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{appointment.name}</div>
                            <div className="text-xs text-muted-foreground">{appointment.service}</div>
                          </div>
                        </div>
                        <div className="text-sm font-mono">{appointment.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* AI assistant preview */}
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-neon-blue" />
                    <span className="text-sm font-medium">Assistente IA</span>
                    <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 text-xs">
                      BETA
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    "Sugestão: Enviar lembrete para Maria Silva sobre seu agendamento às 14:30"
                  </div>
                </div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-primary opacity-20 rounded-3xl blur-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
            >
              ✕
            </button>
            <div className="glass-card rounded-2xl overflow-hidden">
              <iframe
                className="w-full h-64 md:h-96"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="GoAgendas Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}