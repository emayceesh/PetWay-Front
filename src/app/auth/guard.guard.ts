import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';

export const guardGuard: CanActivateFn = (route, state) => {
  let loginService = inject(LoginService);
  let roteador = inject(Router);

  if (state.url == '/admin/marcas/new' && !loginService.hasRole('ADMIN')) {
    window.alert('Usuário sem permissão!');
    roteador.navigate(['/admin/dashboard']);
    return false;
  }

  return true;
};