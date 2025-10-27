import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';  // ✅ importando RouterModule
import { NgChartsModule } from 'ng2-charts';
import { AgendamentoService } from '../../../services/agendamentos.service';
import { ClienteService } from '../../../services/cliente.service';
import { AnimaisService } from '../../../services/animais.service';
import { AnimaisListComponent } from '../../animais/animais-list/animais-list.component';
import { LoginService } from '../../../auth/login.service';
import { Pagina } from '../../../models/pagina';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule, AnimaisListComponent, RouterModule],  // ✅ adicione RouterModule aqui
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(AnimaisListComponent) animaisListComponent!: AnimaisListComponent;

  agendamentoService = inject(AgendamentoService);
  clienteService = inject(ClienteService);
  animaisService = inject(AnimaisService);
  loginService = inject(LoginService);
  router = inject(Router);

  pagina: Pagina = new Pagina();
  numPage: number = 1;
  numQntdPorPagina: number = 5;

  agendamentosTotal: number = 0;
  clientesTotal: number = 0;
  animaisTotal: number = 0;

  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Mais Agendados' }] };
  barChartOptions: ChartOptions = { responsive: true, scales: { y: { beginAtZero: true } } };

  constructor() {}

  public ngOnInit(): void { 
    this.agendamentoService.findAll().subscribe(agendamentos => {
      this.agendamentosTotal = agendamentos.length;
    });

    this.clienteService.findAll(this.numPage, this.numQntdPorPagina).subscribe(clientes => {
      this.clientesTotal = this.pagina.totalElements; 
    });

    this.animaisService.findAll().subscribe(animais => {
      this.animaisTotal = animais.length;
    });
  }

  irParaNovoCliente() { this.router.navigate(['/admin/cliente/new']); }
  irParaAgendamento() { this.router.navigate(['/admin/agendamento']); }
  abrirModalAnimal() { this.animaisListComponent.new(); }
}
