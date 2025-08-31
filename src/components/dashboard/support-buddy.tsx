import { useState } from 'react';
import { MessageCircle, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export function SupportBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Mensagem enviada!",
      description: "Nossa equipe entrará em contato em breve.",
    });
    
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Support Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 animate-scale-in">
          <Card className="shadow-elegant border-border/50 bg-card/95 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-sm">Suporte</CardTitle>
                    <p className="text-xs text-muted-foreground">Como posso ajudar?</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                Olá! 👋 Estou aqui para ajudar com qualquer dúvida sobre o sistema.
              </div>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Digite sua dúvida aqui..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="w-full"
                >
                  Enviar Mensagem
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  FAQ
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Support Buddy Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-elegant bg-primary hover:bg-primary/90 relative animate-float"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              <div className="relative">
                <MessageCircle className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
              </div>
            </>
          )}
        </Button>
      </div>
    </>
  );
}