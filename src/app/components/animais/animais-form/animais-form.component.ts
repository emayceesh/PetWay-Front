import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Animais } from '../../../models/animais';
import { AnimaisService } from '../../../services/animais.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-animais-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './animais-form.component.html',
  styleUrl: './animais-form.component.scss'
})
export class AnimaisFormComponent {

  @Input("animais") animais: Animais = new Animais();
  @Output("meuEvento") meuEvento = new EventEmitter();
  
  @ViewChild("modalClientesList") modalClientesList!: TemplateRef<any>;
  @ViewChild("modalAgendamentosList") modalAgendamentosList!: TemplateRef<any>;
  modalService = inject(MdbModalService); 
  modalRef!: MdbModalRef<any>;
  
  listaClientes!: Cliente[];
  clienteSelecionado!: Cliente["id"];

  rotaAtivida = inject(ActivatedRoute);
  roteador = inject(Router);
  AnimaisService = inject(AnimaisService);
  ClienteService = inject(ClienteService);

  constructor(){
    let id = this.rotaAtivida.snapshot.params['id'];
    if(id){
      this.findById(id);
    }
  }

  findById(id: number){
    this.AnimaisService.findById(id).subscribe({
      next: (animaisRetornados) => {
        this.animais = animaisRetornados;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });
  }

  save(){
    if(this.animais.id){
      // UPDATE
      this.AnimaisService.update(this.animais, this.animais.id).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          // this.roteador.navigate(['admin/animais']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });
    } else {
      // SAVE

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

      this.AnimaisService.save(this.animais).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });
    }
  }

  buscarCliente() {
    this.ClienteService.findAll().subscribe({
      next: (lista) => {
        this.listaClientes = lista;
        this.modalRef = this.modalService.open(this.modalClientesList, { modalClass: 'modal-lg' });
        console.log(this.listaClientes, ClienteService);
      },
      error: (erro) => {
        Swal.fire('Erro ao buscar clientes', erro.error, 'error');
      }
    });
  }

  selecionarCliente(cliente: Cliente) {
    this.animais.cliente = cliente;
    this.modalRef?.close();
  }
  
  

}
