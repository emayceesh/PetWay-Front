import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicos } from '../models/servicos';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  http = inject(HttpClient);

  API = 'http://localhost:8080/api/servicos';

  constructor() { }

  save(servicos: Servicos): Observable<string> {
    return this.http.post<string>(this.API+'/save', servicos, {responseType: 'text' as 'json'});
  }

  update(servicos: Servicos, id: number): Observable<string> {
    return this.http.put<string>(this.API+'/update/'+id, servicos, {responseType: 'text' as 'json'});
  }

  findAll(): Observable<Servicos[]>{
    return this.http.get<Servicos[]>(this.API+'/findAll');
  }

  findById(id: number): Observable<Servicos>{
    return this.http.get<Servicos>(this.API+'/findById/'+id);
  }

  deleteById(id: number): Observable<string>{
    return this.http.delete<string>(this.API+'/delete/'+id, {responseType: 'text' as 'json'});
  }
}
