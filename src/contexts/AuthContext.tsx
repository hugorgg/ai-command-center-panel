
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthUser } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

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
    // Configurar listener de mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // DEPOIS verificar sessão inicial
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user: authUser, error } = await AuthService.signIn(email, password);
    if (authUser) {
      setUser(authUser);
    }
    return { error };
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
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
