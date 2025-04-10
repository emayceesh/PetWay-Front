import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Animais } from '../models/animais';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class AnimaisService {

  http = inject(HttpClient);

  API = 'http://localhost:8080/api/animal';

  constructor() { }


  findAll(): Observable<Animais[]>{
    return this.http.get<Animais[]>(this.API+'/findAll');
  }
   
  findById(id: number): Observable<Animais>{
    return this.http.get<Animais>(this.API+'/findById/'+id);
  }

  findByNome(nome: string): Observable<Animais[]>{
    let par = new HttpParams()
    .set('nome',nome);
    
    return this.http.get<Animais[]>(this.API+'/findByNome', {params: par});
  }

  deleteById(id: number): Observable<string>{
    return this.http.delete<string>(this.API+'/delete/'+id, {responseType: 'text' as 'json'});
  }

  save(animal: Animais): Observable<string> {
    return this.http.post<string>(this.API+'/save', animal, {responseType: 'text' as 'json'});
  }

  update(animal: Animais, id: number): Observable<string> {
    return this.http.put<string>(this.API+'/update/'+id, animal, {responseType: 'text' as 'json'});
  }


}