import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  // Objeto esperado pelo backend:
  // - cliente: objeto com id  
  // - servicos: array com um objeto { id: number }  
  // - dataHora: string no formato "yyyy-MM-ddTHH:mm:ss"  
  // - status: string (default "agendado")
  agendamento: Agendamento = {
    cliente: { id: 0 },
    servicos: [{ id: 0 }],
    dataHora: '',
    status: 'agendado'
  };

  servicos: Servicos[] = [];
  mensagemSucesso: string | null = null;

  constructor(private servicosService: ServicosService) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('AgendamentoFormComponent ngOnChanges:', { cliente: this.cliente, agendamentoParaEdicao: this.agendamentoParaEdicao });
    
    // Se o input "cliente" vier com id, forçamos a conversão para número:
    if (this.cliente && this.cliente.id != null) {
      this.agendamento.cliente = { id: Number(this.cliente.id) };
    } else if (!this.agendamentoParaEdicao) {
      // Se não houver cliente nem agendamento para edição, garantimos que seja zero.
      this.agendamento.cliente = { id: 0 };
    }

    // Se existir agendamentoParaEdicao, preenche o formulário de edição.
    if (this.agendamentoParaEdicao) {
      const ag = this.agendamentoParaEdicao;
      // Se já vem dataHora com espaço, converte para formato do input ("yyyy-MM-ddTHH:mm")
      const dataHoraInput = (ag.dataHora && ag.dataHora.indexOf(' ') !== -1)
        ? ag.dataHora.replace(' ', 'T').substring(0, 16)
        : ag.dataHora;
      const newClienteId = (this.cliente && this.cliente.id != null)
        ? Number(this.cliente.id)
        : (ag.clienteId != null ? Number(ag.clienteId) : 0);
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
      next: (res: Servicos[]) => { this.servicos = res; },
      error: (err) => { console.error('Erro ao carregar serviços', err); }
    });
  }

  salvarAgendamento(): void {
    // O input datetime-local fornece valor no formato "yyyy-MM-ddTHH:mm".
    // Para o backend, precisamos do padrão "yyyy-MM-ddTHH:mm:ss".
    const dataHora = this.agendamento.dataHora;
    const dataHoraFormatada = dataHora && dataHora.length === 16 ? dataHora + ':00' : dataHora;
    
    const payload = {
      cliente: { id: Number(this.agendamento.cliente?.id) },
      servicos: [{
        id: (this.agendamento.servicos && this.agendamento.servicos.length > 0 && this.agendamento.servicos[0].id != null)
              ? Number(this.agendamento.servicos[0].id)
              : 0
      }],
      dataHora: dataHoraFormatada,
      status: this.agendamento.status
    };
    console.log('AgendamentoFormComponent - enviando payload:', payload);
    this.agendamentoSalvo.emit(payload);
    this.mensagemSucesso = 'Agendamento enviado com sucesso!';
    setTimeout(() => this.mensagemSucesso = null, 3000);
    // Reset do formulário (opcional)
    this.agendamento = { cliente: { id: 0 }, servicos: [{ id: 0 }], dataHora: '', status: 'agendado' };
  }
} 
