import { Component, inject } from '@angular/core';
import { Produtos } from '../../../models/produtos';
import { ProdutosService } from '../../../services/produtos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [],
  templateUrl: './produtos-list.component.html',
  styleUrl: './produtos-list.component.scss'
})
export class ProdutosListComponent {
  lista: Produtos[] = [];

  produtosService = inject(ProdutosService);

  constructor() {
    this.findAll();
  }

  findAll(){
    this.produtosService.findAll().subscribe({
      next: (listaRetornada) => {
        this.lista = listaRetornada;
      },
      error: (erro) => {
        alert(erro.error);
      }
    });
  }

  delete(produtos: Produtos){
    Swal.fire({
          title: 'Deseja deletar este produto permanentemente???',
          showCancelButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed){

      this.produtosService.deleteById(produtos.id).subscribe({
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


}