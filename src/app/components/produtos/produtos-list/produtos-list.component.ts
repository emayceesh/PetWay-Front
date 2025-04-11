import { Component, inject } from '@angular/core';
import { Produtos } from '../../../models/produtos';
import { ProdutosService } from '../../../services/produtos.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos-list.component.html',
  styleUrl: './produtos-list.component.scss',
})
export class ProdutosListComponent {
  nomeFiltro!: string;
  categoriaFiltro!: string;
  categoriasDisponiveis!: string[];
  lista!: Produtos[];

  produtosService = inject(ProdutosService);

  constructor() {
    this.findAll();
  }

  ngOnInit(): void {
    this.produtosService.findAll().subscribe((produtos) => {
      this.lista = produtos;

      const normalizadas = new Map<string, string>();

      for (const produto of produtos) {
        const categoriaOriginal = produto.categoria;
        const categoriaNormalizada = this.normalizarTexto(categoriaOriginal);

        if (!normalizadas.has(categoriaNormalizada)) {
          normalizadas.set(categoriaNormalizada, categoriaOriginal);
        }
      }

      this.categoriasDisponiveis = Array.from(normalizadas.values());
    });
  }

  findAll() {
    this.produtosService.findAll().subscribe({
      next: (listaRetornada) => {
        this.lista = listaRetornada;
      },
      error: (erro) => {
        alert(erro.error);
      },
    });
  }

  delete(produtos: Produtos) {
    Swal.fire({
      title: 'Deseja deletar este produto permanentemente???',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.produtosService.deleteById(produtos.id).subscribe({
          next: (mensagem) => {
            Swal.fire(mensagem, '', 'success');
            this.findAll();
          },
          error: (erro) => {
            Swal.fire(erro.error, '', 'error');
          },
        });
      }
    });
  }

  buscarProdutos() {
    if (this.nomeFiltro && this.categoriaFiltro) {
      // Buscar por nome e categoria
      this.produtosService
        .findByNomeAndCategoria(this.nomeFiltro, this.categoriaFiltro)
        .subscribe((res) => {
          this.lista = res;
        });
    } else if (this.nomeFiltro) {
      this.produtosService.findByNome(this.nomeFiltro).subscribe((res) => {
        this.lista = res;
      });
    } else if (this.categoriaFiltro) {
      this.produtosService
        .findByCategoria(this.categoriaFiltro)
        .subscribe((res) => {
          this.lista = res;
        });
    } else {
      this.produtosService.findAll().subscribe((res) => {
        this.lista = res;
      });
    }
  }

  normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
