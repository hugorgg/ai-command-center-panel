
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading, signIn } = useAuth();
  const { toast } = useToast();

  // Se já está autenticado, redireciona
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      console.log('Tentando fazer login...');
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Erro no login:', error);
        toast({
          title: 'Erro no login',
          description: error,
          variant: 'destructive',
        });
      } else {
        console.log('Login bem-sucedido!');
        toast({
          title: 'Login realizado',
          description: 'Bem-vindo ao ComandAI!',
        });
        // O redirecionamento será feito automaticamente via Navigate acima
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast({
        title: 'Erro no login',
        description: 'Erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostra loading enquanto verifica autenticação inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ComandAI</h1>
          <p className="text-[#9ca3af]">Painel de Controle</p>
        </div>

        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-white">Fazer Login</CardTitle>
            <CardDescription className="text-[#9ca3af]">
              Entre com seus dados para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-[#0d1117] border-[#30363d] text-white placeholder:text-[#9ca3af]"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-[#0d1117] border-[#30363d] text-white placeholder:text-[#9ca3af]"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#70a5ff] hover:bg-[#5a8bff] text-white disabled:opacity-50"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <a 
                href="#" 
                className="text-[#70a5ff] hover:underline text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  toast({
                    title: 'Esqueceu a senha?',
                    description: 'Entre em contato com o suporte para recuperar sua senha.',
                  });
                }}
              >
                Esqueceu a senha?
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-[#9ca3af] text-sm">
          <p>Dados de teste:</p>
          <p>E-mail: painel@teste.com</p>
          <p>Senha: 123456</p>
        </div>
      </div>
    </div>
  );
}
