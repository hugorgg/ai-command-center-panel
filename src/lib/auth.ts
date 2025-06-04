
import { supabase } from '@/integrations/supabase/client';

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
      console.log('AuthService: Iniciando login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('AuthService: Erro no Supabase Auth:', error);
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Erro na autenticação' };
      }

      console.log('AuthService: Login bem-sucedido, buscando dados do usuário...');

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
        console.error('AuthService: Erro ao buscar dados do usuário:', usuarioError);
        return { user: null, error: 'Dados do usuário não encontrados' };
      }

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        empresa_id: usuario.empresa_id,
        nome: usuario.nome,
        papel: usuario.papel,
        plano: usuario.empresas.plano,
        empresaNome: usuario.empresas.nome,
      };

      console.log('AuthService: Usuário autenticado:', authUser.nome);
      return { user: authUser, error: null };
    } catch (error) {
      console.error('AuthService: Erro no login:', error);
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

      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select(`
          nome, 
          papel, 
          empresa_id,
          empresas!inner(nome, plano)
        `)
        .eq('auth_user_id', session.user.id)
        .single();

      if (error || !usuario) {
        console.error('AuthService: Erro ao buscar usuário atual:', error);
        return null;
      }

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
      console.error('AuthService: Erro ao buscar usuário atual:', error);
      return null;
    }
  }
}
