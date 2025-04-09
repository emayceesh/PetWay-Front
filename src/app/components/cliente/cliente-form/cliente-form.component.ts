import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';
import { AnimaisService } from '../../../services/animais.service';
import { Animais } from '../../../models/animais';
import { MdbModalService, MdbModalRef, MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { AnimaisListComponent } from "../../animais/animais-list/animais-list.component";

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule, MdbModalModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss'
})
export class ClienteFormComponent {

  @Input("cliente") cliente: Cliente = new Cliente();
  @Output("meuEvento") meuEvento = new EventEmitter();

  listaAnimais!: Animais[];

  rotaAtividade = inject(ActivatedRoute);
  roteador = inject(Router);
  clienteService = inject(ClienteService);
  animaisService = inject(AnimaisService);

  @ViewChild("modalAnimaisList") modalAnimaisList!: TemplateRef<any>; 
  @ViewChild("modalAgendamentosList") modalAgendamentosList!: TemplateRef<any>; 
  modalService = inject(MdbModalService); //para abrir a modal
  modalRef!: MdbModalRef<any>; //pra fechar a modal depois
  

  constructor(){
    let id = this.rotaAtividade.snapshot.params['id'];
    if(id){
      this.findById(id);
    }
  }

  findById(id: number) {

    this.clienteService.findById(id).subscribe({
      next: (clienteRetornado) => {
        this.cliente = clienteRetornado;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });
  }

  save(){
    if(this.cliente.id > 0){
      // UPDATE
      this.clienteService.update(this.cliente, this.cliente.id).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/cliente']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });
    }else{
      // SAVE
      this.clienteService.save(this.cliente).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/cliente']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });


    }
  }

  findAllAnimais(){

    this.animaisService.findAll().subscribe({
      next: (lista) => {
        this.listaAnimais = lista;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });

  }

  meuEventoTratamento(animais: Animais){
    this.cliente.animais = [animais];
    this.modalRef.close();
  }

  compareId(a: Animais, b: Animais) {
    return a && b ? a.id === b.id : a === b;
  }

  buscarAnimal(){
    this.findAllAnimais();
    this.modalRef = this.modalService.open(this.modalAnimaisList, {modalClass: 'modal-xl'});
  }

  selecionarAnimal(animal: Animais) {
    if (!this.cliente.animais) {
      this.cliente.animais = [];
    }
    const jaExiste = this.cliente.animais.some(a => a.id === animal.id);
    if (!jaExiste) {
      this.cliente.animais.push(animal);
    }
    this.modalRef.close();
  }

  novoAnimal() {
    this.modalRef.close();
    this.roteador.navigate(['/admin/animais/new']);
  }
}

