import { Component, inject } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagina } from '../../../models/pagina';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss'
})
export class ClienteListComponent {
  
  lista!: Cliente[];
  pagina: Pagina = new Pagina();
  numPage: number = 1;
  numQntdPorPagina: number = 5;
  nomeFiltro!: string;
  cpfFiltro!: string;

  clienteService = inject(ClienteService);

  constructor() {
    this.findAll();
  }

  findAll(){
    this.clienteService.findAll(this.numPage, this.numQntdPorPagina).subscribe({
      next: (pagina) => {
        this.lista = pagina.content;
        this.pagina = pagina;
      },
      error: (erro) => {
        alert(erro.error);
      }
    });
  }

  delete(cliente: Cliente){
    Swal.fire({
      title: 'Deseja deletar este cliente permanentemente???',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed){

      this.clienteService.deleteById(cliente.id).subscribe({
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

  buscarCliente() {
    if (this.nomeFiltro) {
      this.clienteService.findByNome(this.nomeFiltro).subscribe((res) => {
        this.lista = res;
      });
    } else if (this.cpfFiltro) {
      this.clienteService
        .findByCpf(this.cpfFiltro)
        .subscribe((res) => {
          this.lista = res;
        });
    } else {
      this.clienteService.findAll(this.numPage, this.numQntdPorPagina).subscribe({
      next: (pagina) => {
        this.lista = pagina.content;
      },
      error: (erro) => {
        alert(erro.error);
      }
    });
    }
  }
  trocarPagina(pageClicada: any){
    this.numPage = pageClicada;
    this.findAll();
  }
}