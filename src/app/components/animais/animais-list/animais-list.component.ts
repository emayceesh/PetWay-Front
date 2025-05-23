import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
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
  lista!: Animais[];
  pesquisa!: string;
  racaFiltro!: string;
  racasDisponiveis!: string[];

  animaisEdit!: Animais; 
  modoEdicaoForm: boolean = false;


  @Input("modoModal") modoModal: boolean = false;
  @Output("meuEvento") meuEvento = new EventEmitter();

  animaisService = inject(AnimaisService);

  @ViewChild("modalAnimaisForm") modalAnimaisForm!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;

  constructor() {
    this.findAll();
  }

  ngOnInit(): void {
    this.animaisService.findAll().subscribe((animais) => {
      this.lista = animais;
  
      this.racasDisponiveis = [
        ...new Set(
          animais
            .map(a => a.raca.trim().toLowerCase())
            .map(r => r.charAt(0).toUpperCase() + r.slice(1))
        )
      ];
    });
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
      this.findAll();
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

  buscarAnimais() {
    if (this.pesquisa && this.racaFiltro) {
      this.animaisService.findByNomeAndRaca(this.pesquisa, this.racaFiltro).subscribe((res) => {
        this.lista = res;
      });
    } else if (this.pesquisa) {
      this.findByNome();
    } else if (this.racaFiltro) {
      this.animaisService.findByRaca(this.racaFiltro).subscribe((res) => {
        this.lista = res;
      });
    } else {
      this.findAll();
    }
  }
  

  new(){
    this.animaisEdit = new Animais();  // objeto novo para cadastro
    this.modoEdicaoForm = false;
    this.modalRef = this.modalService.open(this.modalAnimaisForm, { modalClass: 'modal-xl' });
  }

  edit(animal: Animais){
    this.animaisEdit = { ...animal };
    this.modoEdicaoForm = true;
    this.modalRef = this.modalService.open(this.modalAnimaisForm, { modalClass: 'modal-xl' });
  }
  meuEventoTratamento(mensagem: any){
    this.findAll();        
    this.modalRef.close(); 
  }

  selecionar(animais: Animais){
    this.meuEvento.emit(animais); 
  }

}
