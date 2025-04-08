import { Component, inject } from '@angular/core';
import { Servicos } from '../../../models/servicos';
import { ServicosService } from '../../../services/servicos.service';

@Component({
  selector: 'app-servicos-list',
  standalone: true,
  imports: [],
  templateUrl: './servicos-list.component.html',
  styleUrl: './servicos-list.component.scss'
})
export class ServicosListComponent {
  lista: Servicos[] = [];

  servicosService = inject(ServicosService);

  constructor() {
    this.findAll();
  }

  findAll(){
    this.servicosService.findAll().subscribe({
      next: (listaRetornada) => {
        this.lista = listaRetornada;
      },
      error: (erro) => {
        alert(erro.error);
      }
    });
  }

  delete(servicos: Servicos){
    if(confirm('Deseja excluir este serviço?')){

      this.servicosService.deleteById(servicos.id).subscribe({
        next: (mensagem) => {
          alert(mensagem);
          this.findAll();
        },
        error: (erro) => {
          alert(erro.error)
        }
      });

    }
  }

}