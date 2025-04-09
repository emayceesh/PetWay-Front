import { Routes } from '@angular/router';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import { AnimaisListComponent } from './components/animais/animais-list/animais-list.component';
import { AnimaisFormComponent } from './components/animais/animais-form/animais-form.component';
import { AgendamentosListComponent } from './components/agendamento/agendamento-list/agendamento-list.component';
import { AgendamentoFormComponent } from './components/agendamento/agendamento-form/agendamento-form.component';
import { ProdutosListComponent } from './components/produtos/produtos-list/produtos-list.component';
import { ProdutosFormComponent } from './components/produtos/produtos-form/produtos-form.component';
import { ServicosListComponent } from './components/servicos/servicos-list/servicos-list.component';
import { ServicosFormComponent } from './components/servicos/servicos-form/servicos-form.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: 'full'},
    {path: "login", component: LoginComponent},
    {path: "admin", component: PrincipalComponent, children:[
        {path: "dashboard", component: DashboardComponent},
        {path: "cliente", component: ClienteListComponent},
        {path: "cliente/new", component: ClienteFormComponent},
        {path: "cliente/edit/:id", component: ClienteFormComponent},
        {path: "animais", component: AnimaisListComponent},
        {path: "animais/new", component: AnimaisFormComponent},
        {path: "animais/edit/:id", component: AnimaisFormComponent},
        {path: "agendamento", component: AgendamentosListComponent},
        {path: "agendamento/new", component: AgendamentoFormComponent},
        {path: "agendamento/edit/:id", component: AgendamentoFormComponent},
        {path: "produtos", component: ProdutosListComponent},
        {path: "produtos/new", component: ProdutosFormComponent},
        {path: "produtos/edit/:id", component: ProdutosFormComponent},
        {path: "servicos", component: ServicosListComponent},
        {path: "servicos/new", component: ServicosFormComponent},
        {path: "servicos/edit/:id", component: ServicosFormComponent},
    ]}
];
