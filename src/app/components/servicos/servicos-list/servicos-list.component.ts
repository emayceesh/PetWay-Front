import { Component, inject } from '@angular/core';
import { Servicos } from '../../../models/servicos';
import { ServicosService } from '../../../services/servicos.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicos-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './servicos-list.component.html',
  styleUrl: './servicos-list.component.scss'
})
export class ServicosListComponent {
  
  lista: Servicos[] = [];
  nomeFiltro!: string;
  disponibilidadeFiltro!: string;

  servicosService = inject(ServicosService);

  constructor() {
    this.findAll();
  }

  ngOnInit(): void {
    this.buscarServicosPorNome();
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

  buscarServicosPorNome() {
    if (this.nomeFiltro) {
      this.servicosService.findByNome(this.nomeFiltro).subscribe((res) => {
        this.lista = res;
      });
    } else {
      this.servicosService.findAll().subscribe((res) => {
        this.lista = res;
      });
    }
  }

  buscarServicos(): void {
    if (this.nomeFiltro && this.disponibilidadeFiltro !== '') {
      this.servicosService.findByNome(this.nomeFiltro).subscribe(res => {
        this.lista = res.filter(s => s.disponivel.toString() === this.disponibilidadeFiltro);
      });
    } else if (this.nomeFiltro) {
      this.servicosService.findByNome(this.nomeFiltro).subscribe(res => {
        this.lista = res;
      });
    } else if (this.disponibilidadeFiltro !== '') {
      this.servicosService.findByDisponibilidade(this.disponibilidadeFiltro === 'true').subscribe(res => {
        this.lista = res;
      });
    } else {
      this.servicosService.findAll().subscribe(res => {
        this.lista = res;
      });
    }
  }


}