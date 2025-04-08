import { Component, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss'
})
export class ClienteFormComponent {

  cliente: Cliente = new Cliente();

  rotaAtividade = inject(ActivatedRoute);
  roteador = inject(Router);
  clienteService = inject(ClienteService);
  

  constructor(){
    let id = this.rotaAtividade.snapshot.params['id'];
    if(id){
      this.findById(id);
    }
  }

  findById(id: number) {

    this.clienteService.findById(id).subscribe({
      next: (clienteRetornado) => {
        this.cliente = clienteRetornado;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });
  }

  save(){
    if(this.cliente.id > 0){
      // UPDATE
      this.clienteService.update(this.cliente, this.cliente.id).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/cliente']);
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });
    }else{
      // SAVE
      this.clienteService.save(this.cliente).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/cliente']);
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });


    }
  }

}

