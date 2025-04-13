import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agendamento } from '../models/agendamento';
import { Servicos } from '../models/servicos';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  http = inject(HttpClient);
  API = 'http://localhost:8080/api/agendamento';

  constructor() {}

  findAll(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.API}/findAll`);
  }

  findById(id: number): Observable<Agendamento> {
    return this.http.get<Agendamento>(`${this.API}/findById/${id}`);
  }

  findByCliente(nome: string): Observable<Agendamento[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Agendamento[]>(`${this.API}/findByCliente`, { params });
  }

  save(agendamento: Agendamento): Observable<string> {
    return this.http.post<string>(`${this.API}/save`, agendamento, { responseType: 'text' as 'json' });
  }

  update(agendamento: any, id: number): Observable<string> {
    // Garante que o ID no corpo seja o mesmo da URL
    agendamento.id = id;
    return this.http.put<string>(`${this.API}/update/${id}`, agendamento, { 
        responseType: 'text' as 'json' 
    });
}

  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API}/delete/${id}`, { responseType: 'text' as 'json' });
  }
  buscarEntreDatas(start: string, end: string): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.API}/buscarEntreDatas?startDate=${start}&endDate=${end}`);
  }
 
  // buscarPorNome(nomeCliente: string): Observable<Agendamento[]> { 
  //   const params = new HttpParams().set('nomeCliente', nomeCliente);
  //   return this.http.get<Agendamento[]>(`${this.API}/buscarPorNomeCliente`, { params });
  // }
  buscarPorNome(nomeCliente: string) { // ✅ Nome do método alterado
    return this.http.get<any[]>(`${this.API}/buscarPorNomeCliente`, { // ✅ Endpoint correto
      params: { nomeCliente: nomeCliente } // ✅ Parâmetro correto
    });
  }
  
  
}
