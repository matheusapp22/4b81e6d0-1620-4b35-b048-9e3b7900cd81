import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Sparkles, 
  Zap,
  CheckCircle,
  Clock,
  CreditCard
} from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-32 cosmic-bg relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 tech-grid opacity-10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-neon rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="glass-hero rounded-3xl p-12 lg:p-16 text-center space-y-8">
          {/* Badge */}
          <Badge className="glass-card bg-primary/10 text-primary border-primary/20 px-8 py-4 text-sm font-bold">
            <Zap className="w-4 h-4 mr-2" />
            Última Chance de Transformar Seu Negócio
          </Badge>
          
          {/* Headline */}
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="block text-foreground">Transforme</span>
              <span className="block gradient-text">seu negócio</span>
              <span className="block text-foreground text-3xl lg:text-4xl font-medium">
                em apenas 5 minutos
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Junte-se a mais de 1000 profissionais que já revolucionaram 
              seus agendamentos com nossa plataforma inteligente.
            </p>
          </div>
          
          {/* Benefits checklist */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            {[
              { icon: Clock, text: "Setup em 5 minutos" },
              { icon: CreditCard, text: "7 dias grátis" },
              { icon: CheckCircle, text: "Sem cartão de crédito" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              size="xl" 
              className="group bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-12 py-6"
              asChild
            >
              <a href="/auth">
                <Sparkles className="w-6 h-6 mr-3" />
                Experimente Gratuitamente
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6 items-center justify-center text-sm text-muted-foreground pt-8 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Mais de 1000 profissionais confiam</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>50.000+ agendamentos processados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
              <span>Suporte 24/7 em português</span>
            </div>
          </div>
          
          {/* Urgency indicator */}
          <div className="glass-card bg-primary/5 border-primary/20 p-6 rounded-xl">
            <div className="flex items-center justify-center gap-3 text-primary">
              <Zap className="w-5 h-5" />
              <span className="font-medium">
                Oferta especial: 30% de desconto nos primeiros 3 meses para os próximos 100 cadastros
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}