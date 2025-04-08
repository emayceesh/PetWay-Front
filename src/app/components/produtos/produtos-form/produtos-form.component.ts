import { Component, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Produtos } from '../../../models/produtos';
import { ProdutosService } from '../../../services/produtos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produtos-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './produtos-form.component.html',
  styleUrl: './produtos-form.component.scss'
})
export class ProdutosFormComponent {

  produtos: Produtos = new Produtos();

  rotaAtividade = inject(ActivatedRoute);
  roteador = inject(Router);
  produtosService = inject(ProdutosService);

  constructor(){
    let id = this.rotaAtividade.snapshot.params['id'];
    if(id){
      this.findById(id);
    }
  }

  findById(id: number) {

    this.produtosService.findById(id).subscribe({
      next: (produtoRetornado) => {
        this.produtos = produtoRetornado;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });
  }

  save(){
    if(this.produtos.id > 0){
      // UPDATE
      this.produtosService.update(this.produtos, this.produtos.id).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/produtos']);
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });
    }else{
      // SAVE
      this.produtosService.save(this.produtos).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/produtos']);
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });


    }
  }

}

