export interface Agendamento {
    id?: number;
    clienteId: number;
    dataHora: string; 
    servicoId: number;
    observacoes?: string;
    
  }
  