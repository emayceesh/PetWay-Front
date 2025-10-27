import { HttpErrorResponse, HttpInterceptorFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular'; // <-- NOVO IMPORT DO KEYCLOAK
import { catchError, from, Observable, switchMap, throwError } from 'rxjs'; // <-- NOVOS IMPORTS REATIVOS

export const meuhttpInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const keycloakService = inject(KeycloakService); // <-- INJETA O SERVIÇO KEYCLOAK

  // Transforma a Promise de getToken() em um Observable para encaixar no pipeline do interceptor.
  return from(keycloakService.getToken()).pipe( 
    switchMap(token => {
      // Se o token JWT estiver disponível.
      if (token && !request.url.includes('/assets')) {
        // Clona a requisição e adiciona o cabeçalho Authorization com o token do Keycloak.
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      }
      
      // Continua o fluxo e adiciona o tratamento de erro.
      return next(request).pipe(
        catchError((err: any): Observable<HttpEvent<any>> => {
          if (err instanceof HttpErrorResponse) {
            
            // Tratamento do erro 401 (Não Autorizado) - Força o logout e redirecionamento.
            if (err.status === 401) {
              console.error('ERROR 401 - Sessão expirada. Redirecionando para login...');
              // Usa o método seguro de logout do Keycloak, que redireciona o usuário.
              keycloakService.logout(window.location.origin);
            } 
            // Tratamento do erro 403 (Proibido/Sem Permissão) - MANTÉM SUA LÓGICA DE REDIRECIONAMENTO.
            else if (err.status === 403) {
              console.error('ERROR 403 - Usuário sem permissão!');
              router.navigate(['/admin/dashboard']); 
            } else {
              console.error('HTTP error:', err);
            }
          } else {
            console.error('An unexpected error occurred:', err);
          }
          
          return throwError(() => err);
        })
      );
    })
  );
};
