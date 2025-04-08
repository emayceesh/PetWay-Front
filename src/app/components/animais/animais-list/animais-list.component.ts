import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Animais } from '../../../models/animais';
import { AnimaisService } from '../../../services/animais.service';
import { FormsModule } from '@angular/forms';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';
import { AnimaisFormComponent } from "../animais-form/animais-form.component";


@Component({
  selector: 'app-animais-list',
  standalone: true,
  imports: [FormsModule, MdbModalModule, AnimaisFormComponent],
  templateUrl: './animais-list.component.html',
  styleUrl: './animais-list.component.scss'
})
export class AnimaisListComponent {
  lista: Animais[] = [];
  pesquisa: string = "";
  animaisEdit!: Animais; 

  animaisService = inject(AnimaisService);

  @ViewChild("modalAnimaisForm") modalAnimaisForm!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;

  constructor() {
    this.findAll();
  }

  findAll(){
    this.animaisService.findAll().subscribe({
      next: (listaRetornada) => {
        this.lista = listaRetornada;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });
  }

  delete(animal: Animais){
    Swal.fire({
      title: 'Deseja mesmo deletar?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.animaisService.deleteById(animal.id).subscribe({
          next: (mensagem) => {
            Swal.fire(mensagem, '', 'success');
            this.findAll();
          },
          error: (erro) => {
            Swal.fire(erro.error, '', 'error');
          }
        });
      }
    });
  }

  findByNome(){
    if (!this.pesquisa || this.pesquisa.trim() === '') {
      this.findAll(); // volta com todos se pesquisa estiver vazia
      return;
    }
  
    this.animaisService.findByNome(this.pesquisa).subscribe({
      next: (lista) => {
        this.lista = lista;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });
  }

  // Método chamado quando o usuário clica em "Novo"
  new(){
    this.animaisEdit = new Animais();  // objeto novo para cadastro
    this.modalRef = this.modalService.open(this.modalAnimaisForm, { modalClass: 'modal-xl' });
  }

  // Método chamado para editar; recarrega o objeto
  edit(animal: Animais){
    // Clone para evitar alteração direta na lista, se necessário:
    this.animaisEdit = { ...animal };
    this.modalRef = this.modalService.open(this.modalAnimaisForm, { modalClass: 'modal-xl' });
  }

  // Método para tratar o evento emitido pelo formulário quando salvar/atualizar
  meuEventoTratamento(mensagem: any){
    this.findAll();        // atualiza a lista após a operação
    this.modalRef.close(); // fecha o modal
  }
}
