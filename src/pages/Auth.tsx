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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 dot-pattern opacity-20"></div>
      <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-24 h-24 sm:w-32 sm:h-32 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-20 h-20 sm:w-24 sm:h-24 bg-secondary/5 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="w-full max-w-lg space-y-6 sm:space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 mb-6 sm:mb-8 text-muted-foreground hover:text-foreground transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium text-sm sm:text-base">Voltar ao início</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-elevated">
                <Zap className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-success rounded-full flex items-center justify-center animate-bounce-subtle">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <span className="font-bold text-2xl sm:text-3xl gradient-text tracking-tight">GoAgendas</span>
              <Badge variant="secondary" className="block mt-1 w-fit mx-auto sm:mx-0 px-2 sm:px-3 py-1 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium Platform
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3 px-2 sm:px-0">
            <h1 className="text-xl sm:text-headline font-bold">
              {isSignUp ? 'Crie sua conta premium' : 'Faça seu login'}
            </h1>
            <p className="text-sm sm:text-caption leading-relaxed text-muted-foreground">
              {isSignUp 
                ? 'Comece a gerenciar seus agendamentos com tecnologia de ponta'
                : 'Acesse sua conta para continuar'
              }
            </p>
          </div>
        </div>

        {/* Form */}
        <GlassCard variant="premium" className="p-6 sm:p-10 shadow-elevated">
          <form onSubmit={handleSubmit} className="form-premium">
            {isSignUp && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="form-group">
                    <Label htmlFor="firstName" className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      Nome
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Seu nome"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="glass-input h-10 sm:h-12"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="lastName" className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      Sobrenome
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Sobrenome"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="glass-input h-10 sm:h-12"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="businessName" className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4" />
                    Nome do Negócio
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Ex: Barbearia do João"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="glass-input h-10 sm:h-12"
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input h-10 sm:h-12"
                required
              />
            </div>

            <div className="form-group">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4" />
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input h-10 sm:h-12"
                required
                minLength={6}
              />
              {isSignUp && (
                <p className="text-xs sm:text-micro text-muted-foreground flex items-center gap-2 mt-2">
                  <Shield className="w-3 h-3" />
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 sm:h-14"
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
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    {isSignUp ? 'Criar conta premium' : 'Entrar na plataforma'}
                  </span>
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm sm:text-caption text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
            >
              {isSignUp 
                ? 'Já tem uma conta? Faça login'
                : 'Não tem uma conta? Cadastre-se'
              }
            </button>
          </div>
        </GlassCard>

        {/* Trust Indicators */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-micro text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3" />
              <span>LGPD compliant</span>
            </div>
          </div>
          <p className="text-xs sm:text-micro text-muted-foreground px-4 sm:px-0">
            Plano gratuito com até 20 agendamentos por mês
          </p>
        </div>
      </div>
    </div>
  );
}