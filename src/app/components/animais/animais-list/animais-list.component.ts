import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Animais } from '../../../models/animais';
import { AnimaisService } from '../../../services/animais.service';
import { FormsModule } from '@angular/forms';
import { AnimaisFormComponent } from '../animais-form/animais-form.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-animais-list',
  standalone: true,
  imports: [FormsModule,  MdbModalModule],
  templateUrl: './animais-list.component.html',
  styleUrl: './animais-list.component.scss'
})
export class AnimaisListComponent {

  lista: Animais[] = [];
  pesquisa: string = "";
  animaisEdit!: Animais; 

  
  animaisService = inject(AnimaisService);

  @ViewChild("modalAnimaisForm") modalAnimaisForm!: TemplateRef<any>; //referência ao template da modal
  modalService = inject(MdbModalService); //para abrir a modal
  modalRef!: MdbModalRef<any>; //vc conseguir fechar a modal depois

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

  delete(animais: Animais){

    Swal.fire({
      title: 'Deseja mesmo deleatr?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: `Cancelar`,
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {

        this.animaisService.deleteById(animais.id).subscribe({
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

    this.animaisService.findByNome(this.pesquisa).subscribe({
      next: (lista) => {
        this.lista = lista;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');;
      }
    })

  }
  new(){ //ABRIRRRRRRRRRRRRRRRRRR
    this.animaisEdit = new Animais(); //limpando o carroEdit para um novo cadastro
    this.modalRef = this.modalService.open(this.modalAnimaisForm, { modalClass: 'modal-xl'});
  }

  edit(animais: Animais){
    this.animaisEdit = animais; //carregando o carroEdit com o carro clicado na tabela
    this.modalRef = this.modalService.open(this.modalAnimaisForm, { modalClass: 'modal-xl'});
  }

  meuEventoTratamento(mensagem:any){
    this.findAll();
    this.modalRef.close();
  }


}
