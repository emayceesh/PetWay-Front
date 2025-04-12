import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Agendamento } from '../../../models/agendamento';
import { Servicos } from '../../../models/servicos';
import { ServicosService } from '../../../services/servicos.service';
import { AgendamentoService } from '../../../services/agendamentos.service';

@Component({
  selector: 'app-agendamento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendamento-form.component.html',
  styleUrls: ['./agendamento-form.component.scss']
})
export class AgendamentoFormComponent implements OnInit, OnChanges {
  @Input() cliente: any;
  @Input() agendamentoParaEdicao: any = null;
  
  // Adicionei o Output para emitir o agendamento salvo ao componente pai
  @Output() agendamentoSalvo = new EventEmitter<any>();

  agendamento: Agendamento = {
    cliente: { id: 0 },
    servicos: [{ id: 0 }],
    dataHora: '',
    status: 'agendado'
  };

  servicos: Servicos[] = [];
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  constructor(
   public  servicosService: ServicosService,
    public agendamentoService: AgendamentoService
  ) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cliente && this.cliente.id != null) {
      this.agendamento.cliente = { id: Number(this.cliente.id) };
    } else if (!this.agendamentoParaEdicao) {
      this.agendamento.cliente = { id: 0 };
    }

    if (this.agendamentoParaEdicao) {
      const ag = this.agendamentoParaEdicao;
      const dataHoraInput =
        ag.dataHora && ag.dataHora.indexOf(' ') !== -1
          ? ag.dataHora.replace(' ', 'T').substring(0, 16)
          : ag.dataHora;
      const newClienteId =
        this.cliente && this.cliente.id != null
          ? Number(this.cliente.id)
          : ag.clienteId != null
          ? Number(ag.clienteId)
          : 0;

      this.agendamento = {
        cliente: { id: newClienteId },
        dataHora: dataHoraInput,
        servicos: [{ id: ag.servicoId != null ? Number(ag.servicoId) : 0 }],
        status: ag.status || 'agendado'
      };
    }
  }

  carregarServicos(): void {
    this.servicosService.findAll().subscribe({
      next: (res: Servicos[]) => (this.servicos = res),
      error: (err) => console.error('Erro ao carregar serviços', err)
    });
  }

  salvarAgendamento(): void {
    const dataHora = this.agendamento.dataHora;
    const dataHoraFormatada =
      dataHora && dataHora.length === 16 ? dataHora + ':00' : dataHora;
  
    const payload = {
      cliente: { id: Number(this.agendamento.cliente?.id) },
      servicos: [
        {
          id: Number(this.agendamento.servicos?.[0]?.id || 0)
        }
      ],
      dataHora: dataHoraFormatada,
      status: this.agendamento.status
    };
  
    console.log('Enviando agendamento ao backend:', payload);
  
    this.agendamentoService.save(payload).subscribe({
      next: (res) => {
        // Emite um objeto completo com os dados do payload mais o ID retornado do backend
        const agendamentoComDadosCompletos = {
          id: (res as any)?.id || null, // se o backend retorna id
          cliente: payload.cliente,
          servicos: payload.servicos,
          dataHora: payload.dataHora,
          status: payload.status
        };
  
        this.agendamentoSalvo.emit(agendamentoComDadosCompletos);
  
        this.mensagemSucesso = 'Agendamento salvo com sucesso!';
        this.mensagemErro = null;
  
        // Limpa o formulário
        this.agendamento = {
          cliente: { id: 0 },
          servicos: [{ id: 0 }],
          dataHora: '',
          status: 'agendado'
        };
  
        setTimeout(() => (this.mensagemSucesso = null), 3000);
      },
      error: (err) => {
        console.error('Erro ao salvar agendamento', err);
        this.mensagemErro = 'Erro ao salvar agendamento!';
        this.mensagemSucesso = null;
      }
    });
  }
  
}
