
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthUser } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (!mounted) return;

        if (session?.user) {
          try {
            const currentUser = await AuthService.getCurrentUser();
            if (mounted) {
              setUser(currentUser);
              setLoading(false);
            }
          } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            if (mounted) {
              setUser(null);
              setLoading(false);
            }
          }
        } else {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      }
    );

    // Verificar sessão inicial
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão inicial:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: authUser, error } = await AuthService.signIn(email, password);
      if (authUser) {
        setUser(authUser);
        return { error: null };
      }
      return { error: error || 'Erro desconhecido no login' };
    } catch (error) {
      console.error('Erro no signIn:', error);
      return { error: 'Erro interno no login' };
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
