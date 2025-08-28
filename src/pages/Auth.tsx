import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { Zap, Mail, Lock, User, Building, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl gradient-text">GoAgendas</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {isSignUp ? 'Crie sua conta' : 'Faça seu login'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp 
              ? 'Comece a gerenciar seus agendamentos hoje mesmo'
              : 'Acesse sua conta para continuar'
            }
          </p>
        </div>

        {/* Form */}
        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Seu nome"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Sobrenome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome do Negócio</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Ex: Barbearia do João"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Carregando...' : (isSignUp ? 'Criar conta' : 'Entrar')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp 
                ? 'Já tem uma conta? Faça login'
                : 'Não tem uma conta? Cadastre-se'
              }
            </button>
          </div>
        </GlassCard>

        {/* Demo info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Plano gratuito com até 20 agendamentos por mês
          </p>
        </div>
      </div>
    </div>
  );
}