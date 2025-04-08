import { Component, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicos } from '../../../models/servicos';
import { ServicosService } from '../../../services/servicos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicos-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './servicos-form.component.html',
  styleUrl: './servicos-form.component.scss'
})
export class ServicosFormComponent {

  servicos: Servicos = new Servicos();

  rotaAtividade = inject(ActivatedRoute);
  roteador = inject(Router);
  servicosService = inject(ServicosService);

  constructor(){
    let id = this.rotaAtividade.snapshot.params['id'];
    if(id){
      this.findById(id);
    }
  }

  findById(id: number) {

    this.servicosService.findById(id).subscribe({
      next: (servicoRetornado) => {
        this.servicos = servicoRetornado;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });
  }

  save(){
    if(this.servicos.id > 0){
      // UPDATE
      this.servicosService.update(this.servicos, this.servicos.id).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/servicos']);
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });
    }else{
      // SAVE
      this.servicosService.save(this.servicos).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          this.roteador.navigate(['admin/servicos']);
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });


    }
  }

}

