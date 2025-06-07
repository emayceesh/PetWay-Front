import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import Swal from 'sweetalert2';

export const guardGuard: CanActivateFn = (route, state) => {
  let loginService = inject(LoginService);
  let roteador = inject(Router);

  //caso seja safado e tente acessar a url diretamente não vai 
  if ((state.url.startsWith('/admin/produtos') || 
      state.url.startsWith('/admin/servicos')) && !loginService.hasRole('ROLE_ADMIN')) {
    
      Swal.fire('Usuário sem permissão!');
    roteador.navigate(['/admin/dashboard']);
    return false;
  }
 
  return true;
};