import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Adicionado
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { AgendamentoFormComponent } from '../agendamento-form/agendamento-form.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { CommonModule } from '@angular/common'; // Adicionado para diretivas comuns

@Component({
  selector: 'app-agendamentos-list',
  standalone: true,
  
  templateUrl: './agendamento-list.component.html',
  imports: [
    CommonModule, 
    FormsModule, 
    MdbModalModule,
    AgendamentoFormComponent,
    
  ],
  styleUrls: ['./agendamento-list.component.scss']
})
export class AgendamentosListComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteSelecionado!: Cliente;
  modalRef!: MdbModalRef<AgendamentoFormComponent>; // Tipagem mais específica
   
  @ViewChild('modalAgendamentoTemplate') modalAgendamentoTemplate!: TemplateRef<any>;

  // Alternativa moderna de injeção (opcional)
  private clienteService = inject(ClienteService);
  private modalService = inject(MdbModalService);

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
    this.modalRef = this.modalService.open(this.modalAgendamentoTemplate, { 
      modalClass: 'modal-lg' 
    });
  }

  tratarAgendamentoSalvo(mensagem: any): void {
    console.log('Agendamento salvo:', mensagem);
    this.modalRef.close();
  }
}