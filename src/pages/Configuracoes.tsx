
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building, Clock, CreditCard, Bot, Lock, Plus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Empresa {
  id: string;
  nome: string;
  email: string;
  plano: string;
  tom_voz: string;
}

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
}

interface HorarioFuncionamento {
  id: string;
  dia_semana: string;
  horario_abertura: string;
  horario_fechamento: string;
}

export default function Configuracoes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingEmpresa, setIsEditingEmpresa] = useState(false);
  const [isServicoDialogOpen, setIsServicoDialogOpen] = useState(false);
  
  const [novoServico, setNovoServico] = useState({
    nome: '',
    descricao: '',
    preco: ''
  });

  const [editedEmpresa, setEditedEmpresa] = useState({
    nome: '',
    tom_voz: ''
  });

  const isProfessional = user?.plano === 'Pro' || user?.plano === 'Plus' || user?.plano === 'Personalizado';
  const isPlusOrPersonalizado = user?.plano === 'Plus' || user?.plano === 'Personalizado';

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      // Carregar dados da empresa
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', user.empresa_id)
        .single();

      if (empresaError) throw empresaError;
      setEmpresa(empresaData);
      setEditedEmpresa({
        nome: empresaData.nome,
        tom_voz: empresaData.tom_voz || 'padrão'
      });

      // Carregar serviços
      const { data: servicosData, error: servicosError } = await supabase
        .from('servicos')
        .select('*')
        .eq('empresa_id', user.empresa_id);

      if (servicosError) throw servicosError;
      setServicos(servicosData || []);

      // Carregar horários
      const { data: horariosData, error: horariosError } = await supabase
        .from('horarios_funcionamento')
        .select('*')
        .eq('empresa_id', user.empresa_id);

      if (horariosError) throw horariosError;
      setHorarios(horariosData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEmpresa = async () => {
    if (!user || !empresa) return;

    try {
      const { error } = await supabase
        .from('empresas')
        .update({
          nome: editedEmpresa.nome,
          tom_voz: editedEmpresa.tom_voz
        })
        .eq('id', user.empresa_id);

      if (error) throw error;

      setEmpresa({
        ...empresa,
        nome: editedEmpresa.nome,
        tom_voz: editedEmpresa.tom_voz
      });

      setIsEditingEmpresa(false);
      toast({
        title: "Sucesso",
        description: "Informações da empresa atualizadas"
      });
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    }
  };

  const createServico = async () => {
    if (!user || !isProfessional) return;

    try {
      const { error } = await supabase
        .from('servicos')
        .insert([{
          empresa_id: user.empresa_id,
          nome: novoServico.nome,
          descricao: novoServico.descricao,
          preco: parseFloat(novoServico.preco)
        }]);

      if (error) throw error;

      setIsServicoDialogOpen(false);
      setNovoServico({ nome: '', descricao: '', preco: '' });
      loadData();
      
      toast({
        title: "Sucesso",
        description: "Serviço criado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o serviço",
        variant: "destructive"
      });
    }
  };

  const deleteServico = async (id: string) => {
    if (!isProfessional) return;

    try {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServicos(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Sucesso",
        description: "Serviço removido com sucesso"
      });
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o serviço",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#70a5ff] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-[#9ca3af] mt-2">Gerencie as configurações do seu negócio</p>
      </div>

      {/* Informações da Empresa */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#9ca3af]">Nome da Empresa</Label>
              {isEditingEmpresa ? (
                <Input
                  value={editedEmpresa.nome}
                  onChange={(e) => setEditedEmpresa({...editedEmpresa, nome: e.target.value})}
                  className="bg-[#0d1117] border-[#30363d] text-white"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-white">{empresa?.nome}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingEmpresa(true)}
                    className="text-[#9ca3af] hover:text-white"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div>
              <Label className="text-[#9ca3af]">E-mail</Label>
              <Input
                value={empresa?.email || ''}
                disabled
                className="bg-[#0d1117] border-[#30363d] text-[#9ca3af]"
              />
            </div>
          </div>
          
          {isEditingEmpresa && (
            <div className="flex gap-2">
              <Button onClick={saveEmpresa} className="bg-[#70a5ff] hover:bg-[#5a8cff]">
                Salvar
              </Button>
              <Button variant="ghost" onClick={() => setIsEditingEmpresa(false)}>
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Serviços e Valores */}
      <Card className={`bg-[#161b22] border-[#30363d] ${!isProfessional ? 'opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Serviços e Valores
              {!isProfessional && <Lock className="h-4 w-4 ml-2 text-gray-400" />}
            </div>
            {isProfessional && (
              <Dialog open={isServicoDialogOpen} onOpenChange={setIsServicoDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#70a5ff] hover:bg-[#5a8cff]">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Serviço
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#161b22] border-[#30363d] text-white">
                  <DialogHeader>
                    <DialogTitle>Novo Serviço</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Nome do Serviço</Label>
                      <Input
                        value={novoServico.nome}
                        onChange={(e) => setNovoServico({...novoServico, nome: e.target.value})}
                        className="bg-[#0d1117] border-[#30363d] text-white"
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={novoServico.descricao}
                        onChange={(e) => setNovoServico({...novoServico, descricao: e.target.value})}
                        className="bg-[#0d1117] border-[#30363d] text-white"
                      />
                    </div>
                    <div>
                      <Label>Preço (R$)</Label>
                      <Input
                        type="number"
                        value={novoServico.preco}
                        onChange={(e) => setNovoServico({...novoServico, preco: e.target.value})}
                        className="bg-[#0d1117] border-[#30363d] text-white"
                      />
                    </div>
                    <Button onClick={createServico} className="w-full bg-[#70a5ff] hover:bg-[#5a8cff]">
                      Criar Serviço
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isProfessional ? (
            <div className="space-y-3">
              {servicos.map((servico) => (
                <div key={servico.id} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                  <div>
                    <h4 className="text-white font-medium">{servico.nome}</h4>
                    <p className="text-[#9ca3af] text-sm">{servico.descricao}</p>
                    <p className="text-[#70a5ff] font-medium">R$ {servico.preco?.toLocaleString('pt-BR')}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteServico(servico.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {servicos.length === 0 && (
                <p className="text-[#9ca3af] text-center py-4">Nenhum serviço cadastrado</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Disponível nos planos Pro, Plus e Personalizado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações da IA */}
      <Card className={`bg-[#161b22] border-[#30363d] ${!isPlusOrPersonalizado ? 'opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Configurações da IA
            {!isPlusOrPersonalizado && <Lock className="h-4 w-4 ml-2 text-gray-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPlusOrPersonalizado ? (
            <div>
              <Label className="text-[#9ca3af]">Tom de Voz da IA</Label>
              <Select 
                value={editedEmpresa.tom_voz} 
                onValueChange={(value) => setEditedEmpresa({...editedEmpresa, tom_voz: value})}
              >
                <SelectTrigger className="bg-[#0d1117] border-[#30363d] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-[#30363d]">
                  <SelectItem value="padrão">Padrão</SelectItem>
                  <SelectItem value="simpático">Simpático</SelectItem>
                  <SelectItem value="objetivo">Objetivo</SelectItem>
                  <SelectItem value="descontraído">Descontraído</SelectItem>
                  <SelectItem value="profissional">Profissional</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={saveEmpresa} 
                className="mt-4 bg-[#70a5ff] hover:bg-[#5a8cff]"
              >
                Salvar Tom de Voz
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Disponível nos planos Plus e Personalizado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
