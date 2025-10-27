// src/app/components/layout/menu/menu.component.ts

import { Component, inject } from '@angular/core'; // ⬅️ IMPORTAR O 'inject' AQUI!
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { LoginService } from '../../../auth/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MdbCollapseModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  loginService = inject(LoginService); // Agora 'inject' está definido

}