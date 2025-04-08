import { Component, inject } from '@angular/core';
import { Servicos } from '../../../models/servicos';
import { ServicosService } from '../../../services/servicos.service';
import Swal from 'sweetalert2';

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
        Swal.fire(erro.error, '', 'error');
      }
    });
  }

  delete(servicos: Servicos){
    if(confirm('Deseja excluir este serviço?')){

      this.servicosService.deleteById(servicos.id).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.findAll();
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });

    }
  }

}