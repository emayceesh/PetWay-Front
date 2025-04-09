import { Agendamento } from "./agendamento";
import { Animais } from "./animais";

export class Cliente {
    id!: number;
    nomeCliente!: string;
    cpf!: string;
    celular!: string;
    telefone!: string;
    endereco!: string;
    cadastroCompleto!: boolean;
    animais!: Animais [];
    agendamentos!: Agendamento[];
}
