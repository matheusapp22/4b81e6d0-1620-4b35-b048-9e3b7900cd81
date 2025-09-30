import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy, Check } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: 'pro' | 'premium';
  planName: string;
  planPrice: string;
}

export function CheckoutModal({ open, onOpenChange, planType, planName, planPrice }: CheckoutModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pixPayload, setPixPayload] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
  });

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
    setFormData({ name: "", email: "", phone: "", document: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Assinar Plano {planName} - {planPrice}/mês
          </DialogTitle>
        </DialogHeader>

        {!pixPayload ? (
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                'Gerar Código PIX'
              )}
            </Button>
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