import { Component, inject } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss'
})
export class ClienteListComponent {
  lista: Cliente[] = [];

  clienteService = inject(ClienteService);

  constructor() {
    this.findAll();
  }

  findAll(){
    this.clienteService.findAll().subscribe({
      next: (listaRetornada) => {
        this.lista = listaRetornada;
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
}