import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Zap, Mail, Lock, User, Building, ArrowLeft, Sparkles, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          business_name: businessName
        });
        
        if (!error) {
          // Don't navigate immediately, user needs to verify email
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (!error) {
          navigate('/dashboard');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 dot-pattern opacity-20"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-secondary/5 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="w-full max-w-lg space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 mb-8 text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Voltar ao início</span>
          </Link>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-elevated">
                <Zap className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-bounce-subtle">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <span className="font-bold text-3xl gradient-text tracking-tight">GoAgendas</span>
              <Badge variant="secondary" className="block mt-1 w-fit mx-auto px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium Platform
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-headline">
              {isSignUp ? 'Crie sua conta premium' : 'Faça seu login'}
            </h1>
            <p className="text-caption leading-relaxed">
              {isSignUp 
                ? 'Comece a gerenciar seus agendamentos com tecnologia de ponta'
                : 'Acesse sua conta para continuar'
              }
            </p>
          </div>
        </div>

        {/* Form */}
        <GlassCard variant="premium" className="p-10 shadow-elevated">
          <form onSubmit={handleSubmit} className="form-premium">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="form-group">
                    <Label htmlFor="firstName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Seu nome"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="glass-input h-12"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="lastName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Sobrenome
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Sobrenome"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="glass-input h-12"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="businessName" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Nome do Negócio
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Ex: Barbearia do João"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="glass-input h-12"
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input h-12"
                required
              />
            </div>

            <div className="form-group">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input h-12"
                required
                minLength={6}
              />
              {isSignUp && (
                <p className="text-micro text-muted-foreground flex items-center gap-2 mt-2">
                  <Shield className="w-3 h-3" />
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-14"
              size="lg"
              variant="futuristic"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Carregando...
                </div>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {isSignUp ? 'Criar conta premium' : 'Entrar na plataforma'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-caption text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
            >
              {isSignUp 
                ? 'Já tem uma conta? Faça login'
                : 'Não tem uma conta? Cadastre-se'
              }
            </button>
          </div>
        </GlassCard>

        {/* Trust Indicators */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-micro text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3" />
              <span>LGPD compliant</span>
            </div>
          </div>
          <p className="text-micro text-muted-foreground">
            Plano gratuito com até 20 agendamentos por mês
          </p>
        </div>
      </div>
    </div>
  );
}