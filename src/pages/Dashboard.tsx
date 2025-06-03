
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardData {
  agendamentos: number;
  atendimentos: number;
  receita: number;
  atividades: any[];
  graficoData: any[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    agendamentos: 0,
    atendimentos: 0,
    receita: 0,
    atividades: [],
    graficoData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Buscar agendamentos do próximo mês
      const { data: agendamentos } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('empresa_id', user.empresa_id)
        .gte('data', new Date().toISOString().split('T')[0]);

      // Buscar atendimentos de hoje
      const { data: atendimentos } = await supabase
        .from('atendimentos')
        .select('*')
        .eq('empresa_id', user.empresa_id)
        .gte('horario', new Date().toISOString().split('T')[0]);

      // Buscar relatório para receita
      const { data: relatorio } = await supabase
        .from('relatorios')
        .select('receita_atual')
        .eq('empresa_id', user.empresa_id)
        .single();

      // Buscar atividades recentes
      const { data: atividades } = await supabase
        .from('atividades')
        .select('*')
        .eq('empresa_id', user.empresa_id)
        .order('data_hora', { ascending: false })
        .limit(5);

      // Gerar dados do gráfico (últimos 7 dias)
      const graficoData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const agendamentosData = agendamentos?.filter(a => a.data === dateStr).length || 0;
        const atendimentosData = atendimentos?.filter(a => 
          a.horario.split('T')[0] === dateStr
        ).length || 0;

        graficoData.push({
          data: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          agendamentos: agendamentosData,
          atendimentos: atendimentosData
        });
      }

      setData({
        agendamentos: agendamentos?.length || 0,
        atendimentos: atendimentos?.length || 0,
        receita: relatorio?.receita_atual || 0,
        atividades: atividades || [],
        graficoData
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#70a5ff] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[#9ca3af] mt-2">Visão geral dos seus dados</p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#9ca3af]">
              Agendamentos
            </CardTitle>
            <Calendar className="h-4 w-4 text-[#70a5ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.agendamentos}</div>
            <p className="text-xs text-[#9ca3af]">
              Próximos agendamentos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#9ca3af]">
              Atendimentos
            </CardTitle>
            <Users className="h-4 w-4 text-[#70a5ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.atendimentos}</div>
            <p className="text-xs text-[#9ca3af]">
              Atendimentos hoje
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#9ca3af]">
              Receita Estimada
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#70a5ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {data.receita.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-[#9ca3af]">
              Receita mensal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico */}
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-white">Últimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.graficoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="data" stroke="#9ca3af" />
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
                  dataKey="agendamentos" 
                  stroke="#70a5ff" 
                  strokeWidth={2}
                  name="Agendamentos"
                />
                <Line 
                  type="monotone" 
                  dataKey="atendimentos" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Atendimentos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Atividades recentes */}
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.atividades.map((atividade, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#70a5ff] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{atividade.descricao}</p>
                    <p className="text-[#9ca3af] text-xs">
                      {new Date(atividade.data_hora).toLocaleString('pt-BR')}
                    </p>
                    {atividade.valor > 0 && (
                      <p className="text-green-400 text-xs">
                        R$ {atividade.valor.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
