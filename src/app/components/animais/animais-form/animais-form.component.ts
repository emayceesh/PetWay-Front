import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Animais } from '../../../models/animais';
import { AnimaisService } from '../../../services/animais.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-animais-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './animais-form.component.html',
  styleUrl: './animais-form.component.scss'
})
export class AnimaisFormComponent {
  @Input("animais") animais: Animais = new Animais();
  @Output("meuEvento") meuEvento = new EventEmitter(); //ELE VAI PEGAR QUALQUER COISA E EMITIR

  listaAnimais!: Animais[];

  rotaAtivida = inject(ActivatedRoute);
  roteador = inject(Router);
  AnimaisService = inject(AnimaisService);
  // marcaService = inject(MarcaService);

  // @ViewChild("modalMarcasList") modalMarcasList!: TemplateRef<any>; //referência ao template da modal
  @ViewChild("modalAnimaisList") modalAnimaisList!: TemplateRef<any>; //referência ao template da modal
  modalService = inject(MdbModalService); //para abrir a modal
  modalRef!: MdbModalRef<any>; 

  constructor(){
    let id = this.rotaAtivida.snapshot.params['id'];
    if(id){
      this.findById(id);
    }
    this.findAllAnimais();
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
    if(this.animais.id > 0){
      // UPDATE
      this.AnimaisService.update(this.animais, this.animais.id).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/carros']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });


    }else{
      // SAVE
      this.AnimaisService.save(this.animais).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/carros']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });

    }
  }

  findAllAnimais(){

    this.AnimaisService.findAll().subscribe({
      next: (lista) => {
        this.listaAnimais = lista;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });

  }

  compareId(a: Animais, b: Animais) {
    return a && b ? a.id === b.id : a === b;
  }



  meuEventoTratamento(animais: Animais){
    this.animais = animais;
    this.modalRef.close();
  }

  // meuEventoTratamentoAcessorio(acessorio: Acessorio){
  //   if(this.carro.acessorios == null)
  //     this.carro.acessorios = [];

  //   this.carro.acessorios.push(acessorio);
  //   this.modalRef.close();
  // }

  buscarMarca(){
    this.modalRef = this.modalService.open(this.modalAnimaisList, {modalClass: 'modal-xl'});
  }

  buscarAcessorios(){
    this.modalRef = this.modalService.open(this.modalAnimaisList, {modalClass: 'modal-xl'});
  }

  // deletarAcessorio(acessorio: Acessorio){
  //   let indice = this.carro.acessorios.findIndex(x => {return x.id == acessorio.id});
  //   this.carro.acessorios.splice(indice,1);
  // }
}
