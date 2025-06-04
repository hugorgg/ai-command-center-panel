
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
    console.log('AuthProvider: Inicializando...');
    
    // Verificar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: Sessão inicial:', session?.user?.email || 'Nenhuma');
        
        if (session?.user) {
          const currentUser = await AuthService.getCurrentUser();
          console.log('AuthProvider: Usuário carregado:', currentUser?.nome || 'Erro');
          setUser(currentUser);
        }
      } catch (error) {
        console.error('AuthProvider: Erro ao verificar sessão inicial:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state change:', event, session?.user?.email);
        
        if (session?.user) {
          try {
            const currentUser = await AuthService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            console.error('AuthProvider: Erro ao carregar usuário:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Tentando login para:', email);
      const { user: authUser, error } = await AuthService.signIn(email, password);
      
      if (authUser) {
        setUser(authUser);
        console.log('AuthProvider: Login bem-sucedido');
        return { error: null };
      }
      
      console.error('AuthProvider: Erro no login:', error);
      return { error: error || 'Erro desconhecido no login' };
    } catch (error) {
      console.error('AuthProvider: Erro no signIn:', error);
      return { error: 'Erro interno no login' };
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      console.log('AuthProvider: Logout realizado');
    } catch (error) {
      console.error('AuthProvider: Erro no logout:', error);
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
