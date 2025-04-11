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
  @Input() agendamentoParaEdicao: any = null;
  @Output() agendamentoSalvo = new EventEmitter<any>();

  // O objeto agendamento agora segue o formato que o backend espera:
  // - cliente: objeto com id  
  // - servicos: array com um objeto {id: number}  
  // - dataHora: string já no formato "yyyy-MM-dd HH:mm:ss"  
  // - status: string (default "agendado")
  agendamento: Agendamento = {
    cliente: { id: 0 },
    servicos: [{ id: 0 }],
    dataHora: '',
    status: 'agendado'
  };

  servicos: Servicos[] = [];
  mensagemSucesso: string | null = null;

  constructor(
    private servicosService: ServicosService
  ) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] && this.cliente) {
      this.agendamento.cliente.id = this.cliente.id;
    }

    if (changes['agendamentoParaEdicao'] && this.agendamentoParaEdicao) {
      // Preenche os dados do agendamento para edição
      const ag = this.agendamentoParaEdicao;
      this.agendamento = {
        cliente: { id: this.cliente?.id ?? 0 },
        dataHora: ag.dataHora, // Assume que a dataHora já esteja no formato correto
        servicos: [{ id: ag.servicoId }],
        status: ag.status || 'agendado'
      };
    }
  }

  carregarServicos(): void {
    this.servicosService.findAll().subscribe({
      next: (res: Servicos[]) => this.servicos = res,
      error: (err) => console.error('Erro ao carregar serviços', err)
    });
  }

  salvarAgendamento(): void {
    console.log('Enviando do formulário:', this.agendamento);
    this.agendamentoSalvo.emit(this.agendamento);
    this.mensagemSucesso = 'Agendamento enviado com sucesso!';
    setTimeout(() => this.mensagemSucesso = null, 3000);
    // Reset opcional
    this.agendamento = { cliente: { id: 0 }, servicos: [{ id: 0 }], dataHora: '', status: 'agendado' };
  }
}
