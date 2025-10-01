import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy, Check, Calendar, Zap, Crown } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: 'pro' | 'premium';
  planName: string;
  planPrice: string;
}

interface PeriodOption {
  months: number;
  label: string;
  monthlyPrice: number;
  totalPrice: number;
  discount?: string;
  icon: any;
}

export function CheckoutModal({ open, onOpenChange, planType, planName, planPrice }: CheckoutModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pixPayload, setPixPayload] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
  });

  // Definir preços base por plano
  const baseMonthlyPrice = planType === 'pro' ? 29 : 59;
  
  // Opções de período com descontos
  const periodOptions: PeriodOption[] = [
    {
      months: 1,
      label: "1 Mês",
      monthlyPrice: baseMonthlyPrice,
      totalPrice: baseMonthlyPrice,
      icon: Calendar,
    },
    {
      months: 6,
      label: "6 Meses",
      monthlyPrice: baseMonthlyPrice * 0.85, // 15% de desconto
      totalPrice: baseMonthlyPrice * 6 * 0.85,
      discount: "15% OFF",
      icon: Zap,
    },
    {
      months: 12,
      label: "1 Ano",
      monthlyPrice: baseMonthlyPrice * 0.7, // 30% de desconto
      totalPrice: baseMonthlyPrice * 12 * 0.7,
      discount: "30% OFF",
      icon: Crown,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para fazer uma assinatura",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-sunize-transaction', {
        body: {
          plan_type: planType,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            document: formData.document,
            document_type: formData.document.length === 11 ? 'CPF' : 'CNPJ'
          }
        }
      });

      if (error) throw error;

      setPixPayload(data.pix_payload);
      
      toast({
        title: "PIX gerado com sucesso!",
        description: "Copie o código PIX abaixo para realizar o pagamento",
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (pixPayload) {
      navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Cole no app do seu banco para pagar",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setPixPayload(null);
    setSelectedPeriod(null);
    setFormData({ name: "", email: "", phone: "", document: "" });
    onOpenChange(false);
  };

  const selectedOption = periodOptions.find(opt => opt.months === selectedPeriod);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {!selectedPeriod 
              ? `Escolha o período - Plano ${planName}`
              : `Assinar Plano ${planName}${selectedOption ? ` - ${selectedOption.label}` : ''}`
            }
          </DialogTitle>
        </DialogHeader>

        {!selectedPeriod ? (
          // Tela de seleção de período
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-6">
              Selecione o período de assinatura e economize mais em planos longos
            </p>
            
            <div className="grid gap-4">
              {periodOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <GlassCard
                    key={option.months}
                    hover
                    className="p-6 cursor-pointer transition-all hover:scale-[1.02]"
                    onClick={() => setSelectedPeriod(option.months)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{option.label}</h3>
                            {option.discount && (
                              <Badge variant="default" className="bg-success text-white">
                                {option.discount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            R$ {option.monthlyPrice.toFixed(2)}/mês
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">
                          R$ {option.totalPrice.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {option.months === 1 ? 'no total' : `economize R$ ${(baseMonthlyPrice * option.months - option.totalPrice).toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        ) : !pixPayload ? (
          // Tela de formulário de dados
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (com DDD)</Label>
              <Input
                id="phone"
                placeholder="+5511999999999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">CPF ou CNPJ</Label>
              <Input
                id="document"
                placeholder="Apenas números"
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value.replace(/\D/g, '') })}
                required
              />
            </div>

            {selectedOption && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Período:</span>
                  <span className="font-bold">{selectedOption.label}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total a pagar:</span>
                  <span className="text-xl font-bold gradient-text">
                    R$ {selectedOption.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSelectedPeriod(null)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando PIX...
                  </>
                ) : (
                  'Gerar Código PIX'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Código PIX Copia e Cola:</p>
              <div className="bg-background p-3 rounded border break-all text-xs">
                {pixPayload}
              </div>
            </div>

            <Button onClick={copyPixCode} className="w-full" variant="outline">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Código PIX
                </>
              )}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              <p>Após o pagamento, sua assinatura será ativada automaticamente.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}