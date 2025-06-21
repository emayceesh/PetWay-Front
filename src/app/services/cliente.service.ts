import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { Pagina } from '../models/pagina';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  http = inject(HttpClient);

  API = 'http://localhost:8080/api/cliente';

  constructor() { }

  save(cliente: Cliente): Observable<string> {
    return this.http.post<string>(this.API+'/save', cliente, {responseType: 'text' as 'json'});
  }

  update(cliente: Cliente, id: number): Observable<string> {
    return this.http.put<string>(this.API+'/update/'+id, cliente, {responseType: 'text' as 'json'});
  }

  findAll(numPage: number, numQntdPorPagina: number): Observable<Pagina>{
    return this.http.get<Pagina>(this.API+'/findAll/'+numPage+'/'+numQntdPorPagina);
  }

  findById(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(this.API+'/findById/'+id);
  }

  deleteById(id: number): Observable<string>{
    return this.http.delete<string>(this.API+'/delete/'+id, {responseType: 'text' as 'json'});
  }

  findByNome(nomeCliente: string): Observable<Cliente[]> {
      const params = new HttpParams().set('nome', nomeCliente);
      return this.http.get<Cliente[]>(this.API + '/findByNome', { params });
  }

  findByCpf(cpfCliente: string): Observable<Cliente[]> {
      const params = new HttpParams().set('cpf', cpfCliente);
      return this.http.get<Cliente[]>(this.API + '/findByCpf', { params });
  }
}