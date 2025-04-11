import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { AgendamentoFormComponent } from '../agendamento-form/agendamento-form.component';
import { AgendamentoService } from '../../../services/agendamentos.service';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agendamentos-list',
  standalone: true,
  templateUrl: './agendamento-list.component.html',
  imports: [CommonModule, FormsModule, MdbModalModule, AgendamentoFormComponent],
  styleUrls: ['./agendamento-list.component.scss']
})
export class AgendamentosListComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteSelecionado!: Cliente;
  agendamentosCriados: any[] = [];
  agendamentosEncontrados: any[] = []; // Lista que armazenará os resultados da busca por período
  mostrarFormularioAgendamento = false;
  modalRef!: MdbModalRef<AgendamentoFormComponent>;

  agendamentoParaEdicao: any = null;

  // Campos para busca por período (usando datetime-local que retorna string no formato yyyy-MM-ddTHH:mm)
  searchStartDate: string = "";
  searchEndDate: string = "";

  @ViewChild('modalAgendamentoTemplate') modalAgendamentoTemplate!: TemplateRef<any>;

  private clienteService = inject(ClienteService);
  private modalService = inject(MdbModalService);
  private agendamentoService = inject(AgendamentoService);

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.findAll().subscribe({
      next: (lista) => { this.clientes = lista; },
      error: (erro) => { console.error('Erro ao carregar clientes', erro); }
    });
  }

  abrirModalAgendamento(cliente: Cliente): void {
    this.clienteSelecionado = cliente;
    this.agendamentoParaEdicao = null;
    this.mostrarFormularioAgendamento = false;
    setTimeout(() => {
      this.mostrarFormularioAgendamento = true;
      this.modalRef = this.modalService.open(this.modalAgendamentoTemplate, { modalClass: 'modal-lg' });
    });
  }

  tratarAgendamentoSalvo(event: any): void {
    // Converte servicoId e clienteId para number e formata dataHora para "yyyy-MM-dd HH:mm:ss"
    const servicoIdConvertido = Number(event.servicoId);
    const clienteIdConvertido = Number(event.clienteId);
    let dataHoraFormatada = event.dataHora;
    if (dataHoraFormatada && dataHoraFormatada.length === 16) {
      dataHoraFormatada = dataHoraFormatada.replace('T', ' ') + ':00';
    }
  
    if (this.agendamentoParaEdicao) {
      // Atualização (edição)
      const id = this.agendamentoParaEdicao.agendamentoId || this.agendamentoParaEdicao.id;
      const body = {
        agendamentoId: id,
        clienteId: clienteIdConvertido,
        servicoId: servicoIdConvertido,
        dataHora: dataHoraFormatada
      };
      console.log('Payload enviado pro backend para update:', body);
  
      this.agendamentoService.update(body, id).subscribe({
        next: (mensagem) => {
          console.log('Agendamento atualizado:', mensagem);
          this.agendamentosCriados = this.agendamentosCriados.map(item =>
            (item.agendamentoId || item.id) === id ? { ...item, ...event } : item
          );
          this.modalRef.close();
          this.agendamentoParaEdicao = null;
          alert('Agendamento atualizado com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao atualizar agendamento:', erro);
          alert('Erro ao atualizar agendamento. Tente novamente.');
        }
      });
  
    } else {
      // Criação de novo agendamento
      const novoAgendamento = {
        ...this.clienteSelecionado,
        ...event,
        id: event.agendamentoId || this.clienteSelecionado.id,
        servicoId: servicoIdConvertido,
        clienteId: clienteIdConvertido,
        dataHora: dataHoraFormatada
      };
  
      if (!this.agendamentosCriados.some(item => item.id === novoAgendamento.id)) {
        this.agendamentosCriados.push(novoAgendamento);
      }
      this.modalRef.close();
    }
  }

  cancelarAgendamento(agendamento: any): void {
    if (!agendamento) {
      console.error('Nenhum agendamento foi passado para cancelamento!');
      return;
    }
  
    const idParaDeletar = agendamento.agendamentoId || agendamento.id;
  
    if (!idParaDeletar) {
      console.error('Agendamento sem ID válido. Dados recebidos:', agendamento);
      alert('Erro ao cancelar: agendamento sem ID válido.');
      return;
    }
  
    console.log('Agendamento recebido para cancelamento:', agendamento);
    console.log('Enviando deleção com ID:', idParaDeletar);
  
    this.agendamentoService.deleteById(idParaDeletar).subscribe({
      next: (mensagem) => {
        console.log('Agendamento deletado no backend:', mensagem);
        this.agendamentosCriados = this.agendamentosCriados.filter(item =>
          (item.agendamentoId || item.id) !== idParaDeletar
        );
        alert('Agendamento cancelado (deletado) com sucesso!');
      },
      error: (erro) => {
        console.error('Erro ao cancelar agendamento:', erro);
        alert('Erro ao cancelar agendamento. Tente novamente.');
      }
    });
  }

  editarAgendamento(agendamento: any): void {
    this.clienteSelecionado = agendamento;
    this.agendamentoParaEdicao = agendamento;
  
    this.mostrarFormularioAgendamento = false;
    setTimeout(() => {
      this.mostrarFormularioAgendamento = true;
      this.modalRef = this.modalService.open(this.modalAgendamentoTemplate, { modalClass: 'modal-lg' });
    });
  }

  /**
   * Busca agendamentos entre datas (período)
   */
  buscarAgendamentosPorPeriodo(): void {
    if (this.searchStartDate && this.searchEndDate) {
      // Adiciona ":00" para incluir os segundos, se necessário.
      const start = this.searchStartDate + ":00";
      const end = this.searchEndDate + ":00";
      console.log(`Buscando agendamentos entre ${start} e ${end}...`);
      this.agendamentoService.buscarEntreDatas(start, end).subscribe({
        next: (result) => {
          console.log('Agendamentos encontrados:', result);
          // Aqui você pode armazenar os resultados em outra variável,
          // ou atualizar a lista de agendamentos exibida.
          this.agendamentosCriados = result;
        },
        error: (erro) => {
          console.error('Erro ao buscar agendamentos entre datas:', erro);
          alert('Erro ao buscar agendamentos entre as datas informadas.');
        }
      });
    } else {
      alert('Por favor, preencha as datas de início e fim para a busca.');
    }
  }

  // Variáveis para busca por período
 
}
