import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { bruteForceProtection, sanitizeInput, validatePasswordStrength } from '@/lib/security';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  profile: any;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { toast } = useToast();

  const refreshProfile = async () => {
    try {
      // Get current session to ensure we have the latest user
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      
      if (!currentUser) {
        console.log('No user found, skipping profile refresh');
        return;
      }
      
      console.log('Refreshing profile for user:', currentUser.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      console.log('Profile refreshed:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in refreshProfile:', error);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener');
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, 'Session:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Defer profile fetch to avoid blocking auth state change
        if (session?.user) {
          setTimeout(() => {
            refreshProfile();
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          refreshProfile();
        }, 0);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      // Sanitizar entrada
      const cleanEmail = sanitizeInput(email.toLowerCase().trim());
      
      // Validar força da senha
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        toast({
          title: "Senha muito fraca",
          description: passwordValidation.feedback.join('. '),
          variant: "destructive",
        });
        return { error: new Error("Senha não atende aos critérios de segurança") };
      }

      // Verificar rate limit
      const identifier = `signup_${cleanEmail}`;
      if (bruteForceProtection.isBlocked(identifier)) {
        toast({
          title: "Muitas tentativas",
          description: "Aguarde antes de tentar novamente.",
          variant: "destructive",
        });
        return { error: new Error("Rate limit excedido") };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });

      if (error) {
        bruteForceProtection.recordAttempt(identifier);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        bruteForceProtection.reset(identifier);
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Sanitizar entrada
      const cleanEmail = sanitizeInput(email.toLowerCase().trim());
      
      // Verificar proteção contra força bruta
      const identifier = `login_${cleanEmail}`;
      if (bruteForceProtection.isBlocked(identifier)) {
        toast({
          title: "Conta temporariamente bloqueada",
          description: "Muitas tentativas de login. Tente novamente em 15 minutos.",
          variant: "destructive",
        });
        return { error: new Error("Rate limit excedido") };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // Registrar tentativa falhada
        const isBlocked = bruteForceProtection.recordAttempt(identifier);
        
        if (isBlocked) {
          toast({
            title: "Conta bloqueada",
            description: "Muitas tentativas falhadas. Conta bloqueada por 15 minutos.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Reset do contador em caso de sucesso
        bruteForceProtection.reset(identifier);
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      profile,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}