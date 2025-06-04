
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  empresa_id: string;
  nome: string;
  papel: string;
  plano: string;
  empresaNome: string;
}

export class AuthService {
  static async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      console.log('Iniciando login para:', email);
      
      // Usar o Supabase Auth oficial
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no Supabase Auth:', error);
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Erro na autenticação' };
      }

      console.log('Login bem-sucedido, buscando dados do usuário...');

      // Buscar dados do usuário na tabela usuarios
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select(`
          nome, 
          papel, 
          empresa_id,
          empresas!inner(nome, plano)
        `)
        .eq('auth_user_id', data.user.id)
        .single();

      if (usuarioError || !usuario) {
        console.error('Erro ao buscar dados do usuário:', usuarioError);
        return { user: null, error: 'Dados do usuário não encontrados' };
      }

      console.log('Dados do usuário carregados:', usuario);

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        empresa_id: usuario.empresa_id,
        nome: usuario.nome,
        papel: usuario.papel,
        plano: usuario.empresas.plano,
        empresaNome: usuario.empresas.nome,
      };

      return { user: authUser, error: null };
    } catch (error) {
      console.error('Erro no login:', error);
      return { user: null, error: 'Erro interno do servidor' };
    }
  }

  static async signOut(): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: usuario } = await supabase
        .from('usuarios')
        .select(`
          nome, 
          papel, 
          empresa_id,
          empresas!inner(nome, plano)
        `)
        .eq('auth_user_id', session.user.id)
        .single();

      if (!usuario) return null;

      return {
        id: session.user.id,
        email: session.user.email!,
        empresa_id: usuario.empresa_id,
        nome: usuario.nome,
        papel: usuario.papel,
        plano: usuario.empresas.plano,
        empresaNome: usuario.empresas.nome,
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }
}
