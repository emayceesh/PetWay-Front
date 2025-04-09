import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgendamentoService } from '../../../services/agendamentos.service';
import { Agendamento } from '../../../models/agendamento';
import { Servicos } from '../../../models/servicos';
import { ServicosService } from '../../../services/servicos.service';

@Component({
  selector: 'app-agendamento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendamento-form.component.html',
  styleUrls: ['./agendamento-form.component.scss']
})
export class AgendamentoFormComponent implements OnInit, OnChanges {
  @Input() cliente: any;
  @Output() agendamentoSalvo = new EventEmitter<any>();

  agendamento: Agendamento = {
    clienteId: 0,
    dataHora: "",
    servicoId: 0
  };

  servicos: Servicos[] = [];
  mensagemSucesso: string | null = null;

  constructor(
    public agendamentoService: AgendamentoService,
    public servicosService: ServicosService
  ) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] && this.cliente) {
      this.agendamento.clienteId = this.cliente.id;
    }
  }

  carregarServicos(): void {
    this.servicosService.findAll().subscribe({
      next: (lista: Servicos[]) => {
        this.servicos = lista;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar serviços:', erro);
      }
    });
  }

  salvarAgendamento(): void {
    if (this.agendamento.dataHora && this.agendamento.dataHora.length === 16) {
      this.agendamento.dataHora = this.agendamento.dataHora + ":00";
    }

    const agendamentoPayload: any = {
      dataHora: this.agendamento.dataHora,
      cliente: { id: this.agendamento.clienteId },
      servicos: [{ id: Number(this.agendamento.servicoId) }]
    };

    if (this.agendamento.observacoes) {
      agendamentoPayload.observacoes = this.agendamento.observacoes;
    }

    this.agendamentoService.save(agendamentoPayload).subscribe({
      next: (mensagem) => {
        this.mensagemSucesso = '✅ Agendamento salvo com sucesso!';
        this.agendamentoSalvo.emit(mensagem);

        setTimeout(() => {
          this.mensagemSucesso = null;
        }, 5000);

        // Reset opcional:
        this.agendamento.dataHora = "";
        this.agendamento.servicoId = 0;
      },
      error: (erro) => {
        console.error('Erro ao salvar agendamento:', erro);
      }
    });
  }
}
