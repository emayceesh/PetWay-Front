export interface Agendamento {
  id?: number;
  cliente: { id: number };
  servicos: { id: number }[];
  dataHora: string;
  status: string;
  buscarEntregar?: boolean;
  observacoes?: string;
  animais?: any[]; // ou tipa corretamente
}
