import { Component, inject } from '@angular/core';
import { Produtos } from '../../../models/produtos';
import { ProdutosService } from '../../../services/produtos.service';

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
    if(confirm('Deseja excluir este cliente?')){

      this.produtosService.deleteById(produtos.id).subscribe({
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