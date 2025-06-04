
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
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: 'Erro no login',
        description: error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Login realizado',
        description: 'Bem-vindo ao ComandAI!',
      });
    }
    
    setLoading(false);
  };

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
                  className="bg-[#0d1117] border-[#30363d] text-white placeholder:text-[#9ca3af]"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#70a5ff] hover:bg-[#5a8bff] text-white"
              >
                {loading ? 'Entrando...' : 'Entrar'}
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
          <p>Senha: password</p>
        </div>
      </div>
    </div>
  );
}
