
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Download, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface RelatorioData {
  receita_atual: number;
  receita_ia: number;
  comparativo_mes: any;
  projecoes: any;
  feedbacks: any[];
}

export default function Relatorios() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [relatorio, setRelatorio] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(true);

  const isPlusOrPersonalizado = user?.plano === 'Plus' || user?.plano === 'Personalizado';

  useEffect(() => {
    loadRelatorio();
  }, [user]);

  const loadRelatorio = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('relatorios')
        .select('*')
        .eq('empresa_id', user.empresa_id)
        .single();

      if (error) throw error;
      setRelatorio(data);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os relatórios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!isPlusOrPersonalizado) {
      toast({
        title: "Recurso Premium",
        description: "A geração de PDF está disponível apenas nos planos Plus e Personalizado",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Gerando PDF",
      description: "Relatório em PDF será baixado em breve"
    });
  };

  const projecaoData = [
    { mes: 'Jan', receita: 15000, projecao: 18000 },
    { mes: 'Fev', receita: 18000, projecao: 22000 },
    { mes: 'Mar', receita: 22000, projecao: 25000 },
    { mes: 'Abr', receita: 25000, projecao: 28000 },
    { mes: 'Mai', receita: 28000, projecao: 32000 },
    { mes: 'Jun', receita: 32000, projecao: 35000 },
  ];

  const comparativoData = [
    { periodo: 'Mês Anterior', atendimentos: 45, receita: 15000 },
    { periodo: 'Mês Atual', atendimentos: 62, receita: 22000 },
  ];

  if (loading) {
    return (
      <div className="text-white text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#70a5ff] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">Carregando relatórios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios</h1>
          <p className="text-[#9ca3af] mt-2">Análise detalhada do seu negócio</p>
        </div>
        
        {isPlusOrPersonalizado ? (
          <Button onClick={generatePDF} className="bg-[#70a5ff] hover:bg-[#5a8cff]">
            <Download className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
        ) : (
          <Button disabled className="bg-gray-600 cursor-not-allowed">
            <Lock className="h-4 w-4 mr-2" />
            PDF (Premium)
          </Button>
        )}
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#9ca3af]">
              Receita Atual
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#70a5ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {relatorio?.receita_atual?.toLocaleString('pt-BR') || '0'}
            </div>
            <p className="text-xs text-[#9ca3af]">
              Faturamento do mês atual
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#9ca3af]">
              Receita Gerada por IA
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {relatorio?.receita_ia?.toLocaleString('pt-BR') || '0'}
            </div>
            <p className="text-xs text-[#9ca3af]">
              Agendamentos via assistente IA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparativo */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="text-white">Comparativo de Atendimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparativoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="periodo" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#161b22', 
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#ffffff'
                }} 
              />
              <Bar dataKey="atendimentos" fill="#70a5ff" name="Atendimentos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Projeção - Premium Only */}
      <Card className={`bg-[#161b22] border-[#30363d] ${!isPlusOrPersonalizado ? 'opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            Projeção de Faturamento
            {!isPlusOrPersonalizado && <Lock className="h-4 w-4 ml-2 text-gray-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPlusOrPersonalizado ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projecaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#161b22', 
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#70a5ff" 
                  strokeWidth={2}
                  name="Receita Real"
                />
                <Line 
                  type="monotone" 
                  dataKey="projecao" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Projeção"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Disponível nos planos Plus e Personalizado</p>
                <Button className="mt-4 bg-[#70a5ff] hover:bg-[#5a8cff]">
                  Fazer Upgrade
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights Premium */}
      {isPlusOrPersonalizado && (
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-white">Insights Avançados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
                <h4 className="text-white font-semibold mb-2">📈 Tendência de Crescimento</h4>
                <p className="text-[#9ca3af] text-sm">
                  Seu negócio teve um crescimento de 38% no último mês. A IA contribuiu com 
                  R$ {relatorio?.receita_ia?.toLocaleString('pt-BR') || '0'} em novos agendamentos.
                </p>
              </div>
              <div className="p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
                <h4 className="text-white font-semibold mb-2">🎯 Recomendações</h4>
                <p className="text-[#9ca3af] text-sm">
                  Baseado nos dados, recomendamos aumentar a disponibilidade nos horários de pico 
                  (14h-17h) para maximizar o faturamento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
