import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Phone, Instagram, Globe, Clock, Star, QrCode, Copy, MessageCircle, Calendar } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";

export function BioLinkDemo() {
  useScrollAnimation();
  
  return (
    <section id="biolink" className="py-24 bg-gradient-to-b from-background to-muted/20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 dot-pattern opacity-15"></div>
      <div className="absolute top-20 left-20 w-40 h-40 bg-primary/3 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary/5 rounded-full blur-2xl animate-pulse-glow"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-slide-up">
            <QrCode className="w-4 h-4 mr-2" />
            Bio Link Profissional
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-foreground">Seu Perfil</span>
            <br />
            <span className="gradient-text">Profissional Online</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Crie um link único com todos os seus serviços, horários e formas de contato. 
            Compartilhe facilmente e receba agendamentos 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Description */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Link Personalizado</h3>
                  <p className="text-muted-foreground">
                    Tenha seu próprio link (ex: goagendas.com/seunome) com design totalmente customizável.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Agendamento Direto</h3>
                  <p className="text-muted-foreground">
                    Clientes podem ver seus serviços e agendar diretamente pelo bio link, sem precisar de apps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-info" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">WhatsApp Integrado</h3>
                  <p className="text-muted-foreground">
                    Botão direto para WhatsApp com mensagem automática personalizada para cada serviço.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 sm:flex-none" asChild>
                <Link to="/biolink-editor">
                  <QrCode className="w-4 h-4 mr-2" />
                  Criar Meu Bio Link
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-none" asChild>
                <a href="#biolink-example" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('biolink-example')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Ver Exemplo Completo
                </a>
              </Button>
            </div>
          </div>

          {/* Right Side - Bio Link Mock */}
          <div id="biolink-example" className="relative animate-scale-in" style={{ animationDelay: '0.8s' }}>
            {/* Mobile Frame */}
            <div className="relative mx-auto max-w-sm">
              <div className="bg-card border-8 border-foreground/10 rounded-[2.5rem] p-6 shadow-2xl">
                {/* Header */}
                <div className="text-center space-y-4 mb-6">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto ring-4 ring-primary/20">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-card flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">Marina Silva</h3>
                    <p className="text-sm text-muted-foreground">Studio de Beleza & Bem-estar</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">(4.9)</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">
                      <Clock className="w-4 h-4 mr-1" />
                      Horários
                    </Button>
                    <Button variant="outline" size="sm">
                      <Instagram className="w-4 h-4 mr-1" />
                      Instagram
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Services */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-center">Nossos Serviços</h4>
                  
                  {[
                    { name: "Corte + Escova", price: "R$ 85", duration: "1h30" },
                    { name: "Manicure + Pedicure", price: "R$ 65", duration: "1h15" },
                    { name: "Massagem Relaxante", price: "R$ 120", duration: "1h" }
                  ].map((service, index) => (
                    <GlassCard key={index} variant="minimal" className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{service.name}</div>
                          <div className="text-xs text-muted-foreground">{service.duration}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm text-primary">{service.price}</div>
                          <Button size="sm" variant="outline" className="text-xs h-6 px-2 mt-1">
                            Agendar
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>

                {/* QR Code Section */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4 text-muted-foreground" />
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar Link
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4">
                  <p className="text-xs text-muted-foreground">
                    Powered by <span className="font-medium text-primary">GoAgendas</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}