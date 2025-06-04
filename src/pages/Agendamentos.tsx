
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Agendamento {
  id: string;
  nome_cliente: string;
  telefone: string;
  servico: string;
  valor: number;
  data: string;
  hora: string;
  status: string;
}

export default function Agendamentos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('');

  const [novoAgendamento, setNovoAgendamento] = useState({
    nome_cliente: '',
    telefone: '',
    servico: '',
    valor: '',
    data: '',
    hora: ''
  });

  useEffect(() => {
    loadAgendamentos();
  }, [user]);

  const loadAgendamentos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('empresa_id', user.empresa_id)
        .order('data', { ascending: true });

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgendamento = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('agendamentos')
        .insert([{
          empresa_id: user.empresa_id,
          nome_cliente: novoAgendamento.nome_cliente,
          telefone: novoAgendamento.telefone,
          servico: novoAgendamento.servico,
          valor: parseFloat(novoAgendamento.valor),
          data: novoAgendamento.data,
          hora: novoAgendamento.hora,
          status: 'novo'
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso"
      });

      setIsDialogOpen(false);
      setNovoAgendamento({
        nome_cliente: '',
        telefone: '',
        servico: '',
        valor: '',
        data: '',
        hora: ''
      });
      loadAgendamentos();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o agendamento",
        variant: "destructive"
      });
    }
  };

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const statusMatch = statusFilter === 'todos' || agendamento.status === statusFilter;
    const dateMatch = !dateFilter || agendamento.data === dateFilter;
    return statusMatch && dateMatch;
  });

  if (loading) {
    return (
      <div className="text-white text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#70a5ff] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">Carregando agendamentos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
          <p className="text-[#9ca3af] mt-2">Gerencie todos os seus agendamentos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#70a5ff] hover:bg-[#5a8cff]">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#161b22] border-[#30363d] text-white">
            <DialogHeader>
              <DialogTitle>Criar Novo Agendamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Cliente</Label>
                <Input
                  id="nome"
                  value={novoAgendamento.nome_cliente}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, nome_cliente: e.target.value})}
                  className="bg-[#0d1117] border-[#30363d] text-white"
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novoAgendamento.telefone}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, telefone: e.target.value})}
                  className="bg-[#0d1117] border-[#30363d] text-white"
                />
              </div>
              <div>
                <Label htmlFor="servico">Serviço</Label>
                <Input
                  id="servico"
                  value={novoAgendamento.servico}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, servico: e.target.value})}
                  className="bg-[#0d1117] border-[#30363d] text-white"
                />
              </div>
              <div>
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  value={novoAgendamento.valor}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, valor: e.target.value})}
                  className="bg-[#0d1117] border-[#30363d] text-white"
                />
              </div>
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={novoAgendamento.data}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, data: e.target.value})}
                  className="bg-[#0d1117] border-[#30363d] text-white"
                />
              </div>
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={novoAgendamento.hora}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, hora: e.target.value})}
                  className="bg-[#0d1117] border-[#30363d] text-white"
                />
              </div>
              <Button onClick={handleCreateAgendamento} className="w-full bg-[#70a5ff] hover:bg-[#5a8cff]">
                Criar Agendamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <Label className="text-[#9ca3af]">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-[#0d1117] border-[#30363d] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-[#30363d]">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#9ca3af]">Data</Label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-[#0d1117] border-[#30363d] text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Agendamentos */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="text-white">Lista de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#30363d]">
                <TableHead className="text-[#9ca3af]">Cliente</TableHead>
                <TableHead className="text-[#9ca3af]">Telefone</TableHead>
                <TableHead className="text-[#9ca3af]">Serviço</TableHead>
                <TableHead className="text-[#9ca3af]">Valor</TableHead>
                <TableHead className="text-[#9ca3af]">Data</TableHead>
                <TableHead className="text-[#9ca3af]">Hora</TableHead>
                <TableHead className="text-[#9ca3af]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgendamentos.map((agendamento) => (
                <TableRow key={agendamento.id} className="border-[#30363d]">
                  <TableCell className="text-white">{agendamento.nome_cliente}</TableCell>
                  <TableCell className="text-white">{agendamento.telefone}</TableCell>
                  <TableCell className="text-white">{agendamento.servico}</TableCell>
                  <TableCell className="text-white">R$ {agendamento.valor?.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-white">{new Date(agendamento.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-white">{agendamento.hora}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      agendamento.status === 'confirmado' ? 'bg-green-500/20 text-green-400' :
                      agendamento.status === 'cancelado' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {agendamento.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
