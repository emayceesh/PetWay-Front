import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produtos } from '../models/produtos';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  http = inject(HttpClient);

  API = 'http://localhost:8080/api/produtos';

  constructor() { }

  save(produtos: Produtos): Observable<string> {
    return this.http.post<string>(this.API+'/save', produtos, {responseType: 'text' as 'json'});
  }

  update(produtos: Produtos, id: number): Observable<string> {
    return this.http.put<string>(this.API+'/update/'+id, produtos, {responseType: 'text' as 'json'});
  }

  findAll(): Observable<Produtos[]>{
    return this.http.get<Produtos[]>(this.API+'/findAll');
  }

  findById(id: number): Observable<Produtos>{
    return this.http.get<Produtos>(this.API+'/findById/'+id);
  }

  deleteById(id: number): Observable<string>{
    return this.http.delete<string>(this.API+'/delete/'+id, {responseType: 'text' as 'json'});
  }
}
