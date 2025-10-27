import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular'; 
import Swal from 'sweetalert2'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    // 'override' OBRIGATÓRIO para 'router'
    protected override router: Router,
    // 'override' REMOVIDO para 'keycloakService' (corrigindo o TS4113)
    protected keycloakService: KeycloakService 
  ) {
    super(router, keycloakService);
  }

  // O método isAccessAllowed é chamado para verificar a autenticação e autorização
  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    
    // 1. CHECAGEM DE AUTENTICAÇÃO
    if (!this.authenticated) {
      await this.keycloakService.login({
        redirectUri: window.location.origin + state.url
      });
      return false; 
    }

    // 2. CHECAGEM DE PERMISSÃO (Lógica customizada de Role)
    const isAdmin = this.keycloakService.isUserInRole('admin'); 

    if ((state.url.startsWith('/admin/produtos') || 
         state.url.startsWith('/admin/servicos')) && !isAdmin) {
      
      Swal.fire('Usuário sem permissão!');
      this.router.navigate(['/admin/dashboard']);
      return false;
    }
    return true;
  }
}
