export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agendamentos: {
        Row: {
          data: string | null
          empresa_id: string | null
          hora: string | null
          id: string
          nome_cliente: string | null
          servico: string | null
          status: string | null
          telefone: string | null
          valor: number | null
        }
        Insert: {
          data?: string | null
          empresa_id?: string | null
          hora?: string | null
          id?: string
          nome_cliente?: string | null
          servico?: string | null
          status?: string | null
          telefone?: string | null
          valor?: number | null
        }
        Update: {
          data?: string | null
          empresa_id?: string | null
          hora?: string | null
          id?: string
          nome_cliente?: string | null
          servico?: string | null
          status?: string | null
          telefone?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      atendimentos: {
        Row: {
          empresa_id: string | null
          horario: string | null
          id: string
          nome_cliente: string | null
          servico: string | null
          status: string | null
        }
        Insert: {
          empresa_id?: string | null
          horario?: string | null
          id?: string
          nome_cliente?: string | null
          servico?: string | null
          status?: string | null
        }
        Update: {
          empresa_id?: string | null
          horario?: string | null
          id?: string
          nome_cliente?: string | null
          servico?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atendimentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      atividades: {
        Row: {
          data_hora: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          tipo: string | null
          valor: number | null
        }
        Insert: {
          data_hora?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          tipo?: string | null
          valor?: number | null
        }
        Update: {
          data_hora?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          tipo?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "atividades_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_ia: {
        Row: {
          empresa_id: string | null
          id: string
          modelo: string | null
          parametros: Json | null
        }
        Insert: {
          empresa_id?: string | null
          id?: string
          modelo?: string | null
          parametros?: Json | null
        }
        Update: {
          empresa_id?: string | null
          id?: string
          modelo?: string | null
          parametros?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_ia_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          email: string
          horarios: Json | null
          id: string
          metodos_pagamento: Json | null
          nome: string
          plano: string | null
          senha: string
          servicos: Json | null
          tom_voz: string | null
        }
        Insert: {
          email: string
          horarios?: Json | null
          id?: string
          metodos_pagamento?: Json | null
          nome: string
          plano?: string | null
          senha: string
          servicos?: Json | null
          tom_voz?: string | null
        }
        Update: {
          email?: string
          horarios?: Json | null
          id?: string
          metodos_pagamento?: Json | null
          nome?: string
          plano?: string | null
          senha?: string
          servicos?: Json | null
          tom_voz?: string | null
        }
        Relationships: []
      }
      horarios_funcionamento: {
        Row: {
          dia_semana: string | null
          empresa_id: string | null
          horario_abertura: string | null
          horario_fechamento: string | null
          id: string
        }
        Insert: {
          dia_semana?: string | null
          empresa_id?: string | null
          horario_abertura?: string | null
          horario_fechamento?: string | null
          id?: string
        }
        Update: {
          dia_semana?: string | null
          empresa_id?: string | null
          horario_abertura?: string | null
          horario_fechamento?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "horarios_funcionamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      metodos_pagamento: {
        Row: {
          detalhes: Json | null
          empresa_id: string | null
          id: string
          tipo: string | null
        }
        Insert: {
          detalhes?: Json | null
          empresa_id?: string | null
          id?: string
          tipo?: string | null
        }
        Update: {
          detalhes?: Json | null
          empresa_id?: string | null
          id?: string
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metodos_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          data_pagamento: string | null
          empresa_id: string | null
          id: string
          metodo: string | null
          status: string | null
          valor: number
        }
        Insert: {
          data_pagamento?: string | null
          empresa_id?: string | null
          id?: string
          metodo?: string | null
          status?: string | null
          valor: number
        }
        Update: {
          data_pagamento?: string | null
          empresa_id?: string | null
          id?: string
          metodo?: string | null
          status?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios: {
        Row: {
          comparativo_mes: Json | null
          empresa_id: string | null
          feedbacks: Json | null
          id: string
          projecoes: Json | null
          receita_atual: number | null
          receita_ia: number | null
        }
        Insert: {
          comparativo_mes?: Json | null
          empresa_id?: string | null
          feedbacks?: Json | null
          id?: string
          projecoes?: Json | null
          receita_atual?: number | null
          receita_ia?: number | null
        }
        Update: {
          comparativo_mes?: Json | null
          empresa_id?: string | null
          feedbacks?: Json | null
          id?: string
          projecoes?: Json | null
          receita_atual?: number | null
          receita_ia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
          preco: number | null
        }
        Insert: {
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          preco?: number | null
        }
        Update: {
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          preco?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "servicos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          auth_user_id: string
          email: string | null
          empresa_id: string | null
          id: string
          nome: string | null
          papel: string | null
        }
        Insert: {
          auth_user_id: string
          email?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string | null
          papel?: string | null
        }
        Update: {
          auth_user_id?: string
          email?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string | null
          papel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
