// src/app/auth/login.service.ts (Versão Completa Corrigida)

import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private keycloakService: KeycloakService) {}

  // força o fluxo de login (redireciona para Keycloak)
  async login(redirectUri?: string): Promise<void> {
    return this.keycloakService.login({ redirectUri: redirectUri ?? window.location.href });
  }

  // logout via Keycloak
  async logout(redirectUri?: string): Promise<void> {
    return this.keycloakService.logout(redirectUri ?? window.location.origin);
  }

  // retorna o token JWT (Promise)
  async getToken(): Promise<string | null> {
    try {
      const token = await this.keycloakService.getToken();
      return token ?? null;
    } catch (e) {
      console.error('Erro ao obter token Keycloak', e);
      return null;
    }
  }

  // checa se usuário está autenticado
  async isLoggedIn(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  // ** MÉTODO ADICIONADO PARA RESOLVER O ERRO NG9/TS2339 **
  /**
   * Verifica se o usuário autenticado possui o papel especificado.
   * @param role O papel (role) a ser verificado (ex: 'ROLE_ADMIN').
   * @returns true se o usuário tiver o papel.
   */
  hasRole(role: string): boolean {
    // A checagem de permissão é feita pelo serviço Keycloak
    return this.keycloakService.isUserInRole(role); 
  }

  // opcional: pega informações do usuário
  async getUserProfile(): Promise<any> {
    return this.keycloakService.getKeycloakInstance().loadUserInfo();
  }
}