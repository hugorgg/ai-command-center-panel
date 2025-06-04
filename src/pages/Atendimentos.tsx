
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Atendimento {
  id: string;
  nome_cliente: string;
  servico: string;
  horario: string;
  status: string;
}

export default function Atendimentos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAtendimentos();
  }, [user]);

  const loadAtendimentos = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('atendimentos')
        .select('*')
        .eq('empresa_id', user.empresa_id)
        .gte('horario', today)
        .order('horario', { ascending: true });

      if (error) throw error;
      setAtendimentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os atendimentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('atendimentos')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setAtendimentos(prev => 
        prev.map(atendimento => 
          atendimento.id === id 
            ? { ...atendimento, status: newStatus }
            : atendimento
        )
      );

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive"
      });
    }
  };

  const getAtendimentosByStatus = (status: string) => {
    return atendimentos.filter(atendimento => atendimento.status === status);
  };

  const AtendimentoCard = ({ atendimento }: { atendimento: Atendimento }) => (
    <div
      className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 cursor-move hover:border-[#70a5ff] transition-colors"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', atendimento.id);
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-white font-medium flex items-center">
            <User className="h-4 w-4 mr-2" />
            {atendimento.nome_cliente}
          </h4>
          <p className="text-[#9ca3af] text-sm mt-1">{atendimento.servico}</p>
          <div className="flex items-center mt-2 text-[#9ca3af] text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(atendimento.horario).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const KanbanColumn = ({ title, status, color }: { title: string; status: string; color: string }) => (
    <div className="flex-1">
      <div className="mb-4">
        <Badge className={`${color} text-white`}>
          {title} ({getAtendimentosByStatus(status).length})
        </Badge>
      </div>
      <div
        className="min-h-[400px] bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const atendimentoId = e.dataTransfer.getData('text/plain');
          updateStatus(atendimentoId, status);
        }}
      >
        {getAtendimentosByStatus(status).map((atendimento) => (
          <AtendimentoCard key={atendimento.id} atendimento={atendimento} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-white text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#70a5ff] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">Carregando atendimentos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Atendimentos</h1>
        <p className="text-[#9ca3af] mt-2">Quadro Kanban dos atendimentos de hoje</p>
      </div>

      <div className="flex gap-6">
        <KanbanColumn 
          title="Novos" 
          status="novo" 
          color="bg-yellow-500" 
        />
        <KanbanColumn 
          title="Em Atendimento" 
          status="em_atendimento" 
          color="bg-blue-500" 
        />
        <KanbanColumn 
          title="Concluído" 
          status="concluido" 
          color="bg-green-500" 
        />
      </div>

      <Card className="bg-[#161b22] border-[#30363d]">
        <CardContent className="p-6">
          <p className="text-[#9ca3af] text-sm">
            💡 <strong>Dica:</strong> Arraste os cards entre as colunas para alterar o status dos atendimentos.
            Os cards somem do quadro no final do dia, mas permanecem salvos no histórico.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
