import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { AgendamentoFormComponent } from '../agendamento-form/agendamento-form.component';
import { AgendamentoService } from '../../../services/agendamentos.service';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { CommonModule } from '@angular/common';
import { Pagina } from '../../../models/pagina';

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
  agendamentosEncontrados: any[] = [];
  mostrarFormularioAgendamento = false;
  modalRef!: MdbModalRef<AgendamentoFormComponent>;
  agendamentoParaEdicao: any = null;

  pagina: Pagina = new Pagina();
  numPage: number = 1;
  numQntdPorPagina: number = 5;

  nomeFiltro: string = '';
  

  // Campos para busca por período (em formato "yyyy-MM-ddTHH:mm")
  searchStartDate: string = "";
  searchEndDate: string = "";

  @ViewChild('modalAgendamentoTemplate') modalAgendamentoTemplate!: TemplateRef<any>;

   clienteService = inject(ClienteService);
   modalService = inject(MdbModalService);
   agendamentoService = inject(AgendamentoService);

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.findAll(this.numPage, this.numQntdPorPagina ).subscribe({
      next: (pagina) => { this.clientes = pagina.content; },
      error: (erro) => { console.error('Erro ao carregar clientes', erro); }
    });
  }

  abrirModalAgendamento(cliente: Cliente): void {
    this.clienteSelecionado = cliente;
    this.agendamentoParaEdicao = null; // para criação nova
    this.mostrarFormularioAgendamento = false;
    setTimeout(() => {
      this.mostrarFormularioAgendamento = true;
      this.modalRef = this.modalService.open(this.modalAgendamentoTemplate, { modalClass: 'modal-lg' });
    });
  }

  tratarAgendamentoSalvo(agendamentoSalvo: any): void {
    console.log('Agendamento salvo recebido:', agendamentoSalvo);
    // Adiciona o agendamento salvo à lista local
    this.agendamentosCriados.push(agendamentoSalvo);
    this.modalRef.close();
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
    this.agendamentoService.deleteById(idParaDeletar).subscribe({
      next: (mensagem) => {
        console.log('Agendamento deletado no backend:', mensagem);
        // Remove o agendamento da lista local
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
    // Se o agendamento tiver o objeto "cliente", use-o; caso contrário, utiliza a propriedade "clienteId"
    this.clienteSelecionado = agendamento.cliente ?? { id: agendamento.clienteId };
    // Força nova referência para atualizar o formulário
    this.agendamentoParaEdicao = { ...agendamento };

    this.mostrarFormularioAgendamento = false;
    setTimeout(() => {
      this.mostrarFormularioAgendamento = true;
      this.modalRef = this.modalService.open(this.modalAgendamentoTemplate, { modalClass: 'modal-lg' });
    });
  }

  buscarAgendamentosPorPeriodo(): void {
    if (this.searchStartDate && this.searchEndDate) {
      const start = this.searchStartDate + ":00";
      const end = this.searchEndDate + ":00";
      console.log(`Buscando agendamentos entre ${start} e ${end}...`);
      this.agendamentoService.buscarEntreDatas(start, end).subscribe({
        next: (result) => {
          console.log('Agendamentos encontrados:', result);
          // Atualiza a lista de agendamentos encontrados para exibição
          this.agendamentosEncontrados = result;
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
 // NO COMPONENTE (CORRIGIDO)
buscarPorNome(): void {
  if (this.nomeFiltro) {
    this.agendamentoService.buscarPorNome(this.nomeFiltro).subscribe({ // ✅ Método correto
      next: (result) => {
        this.agendamentosEncontrados = result;
      },
      error: (erro) => {
        console.error('Erro:', erro);
        alert(erro.error?.message || 'Erro ao buscar agendamentos');
      }
    });
  } else {
    this.agendamentosEncontrados = [];
  }
}
}
