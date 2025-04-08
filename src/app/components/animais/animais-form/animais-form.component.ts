import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { Animais } from '../../../models/animais';
import { AnimaisService } from '../../../services/animais.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-animais-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './animais-form.component.html',
  styleUrl: './animais-form.component.scss'
})
export class AnimaisFormComponent {
  @Input("animais") animais: Animais = new Animais();
  @Output("meuEvento") meuEvento = new EventEmitter();

  rotaAtivida = inject(ActivatedRoute);
  roteador = inject(Router);
  AnimaisService = inject(AnimaisService);

  constructor(){
    let id = this.rotaAtivida.snapshot.params['id'];
    if(id){
      this.findById(id);
    }
  }

  findById(id: number){
    this.AnimaisService.findById(id).subscribe({
      next: (animaisRetornados) => {
        this.animais = animaisRetornados;
      },
      error: (erro) => {
        Swal.fire(erro.error, '', 'error');
      }
    });
  }

  save(){
    if(this.animais.id){
      // UPDATE
      this.AnimaisService.update(this.animais, this.animais.id).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          // Se desejar não redirecionar:
          // this.roteador.navigate(['admin/animais']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });
    } else {
      // SAVE
      this.AnimaisService.save(this.animais).subscribe({
        next: (mensagem) => {
          Swal.fire(mensagem, '', 'success');
          // this.roteador.navigate(['admin/animais']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          Swal.fire(erro.error, '', 'error');
        }
      });
    }
  }
}
