import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../auth/login.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],  // ✅ Aqui
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  async logar() {
  await this.loginService.login(window.location.origin + '/admin/dashboard');
}
}
