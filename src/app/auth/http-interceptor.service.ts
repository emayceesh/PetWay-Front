import { HttpErrorResponse, HttpInterceptorFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular'; // <-- NOVO IMPORT DO KEYCLOAK
import { catchError, from, Observable, switchMap, throwError } from 'rxjs'; // <-- NOVOS IMPORTS REATIVOS

export const meuhttpInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const keycloakService = inject(KeycloakService);

  console.log(`🔵🔵🔵 [Interceptor] INICIANDO`);
  console.log(`🔵 METHOD: ${request.method}`);
  console.log(`🔵 URL: ${request.url}`);
  console.log(`🔵 Headers originais:`, request.headers.keys());
  
  // CRÍTICO: Requisições OPTIONS NÃO devem ter token e devem passar direto!
  if (request.method === 'OPTIONS') {
    console.log('✅ [Interceptor] OPTIONS request - NÃO adicionando token, passando direto');
    return next(request);
  }

  console.log(`➡️ [Interceptor] Continuando com ${request.method}, tentando pegar token...`);
  
  // Log antes de clonar
  console.log(`📋 [Interceptor] Request original antes do clone:`, {
    method: request.method,
    url: request.url,
    headers: Array.from(request.headers.keys())
  });

  // Transforma a Promise de getToken() em um Observable para encaixar no pipeline do interceptor.
  return from(keycloakService.getToken()).pipe( 
    switchMap(token => {
      // Se o token JWT estiver disponível.
      if (token && !request.url.includes('/assets')) {
        // Clona a requisição e adiciona o cabeçalho Authorization com o token do Keycloak.
        console.log('🔵 [Interceptor] Adicionando Bearer token');
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        console.log('📋 [Interceptor] Request CLONADO com token. Headers:', Array.from(request.headers.keys()));
      } else {
        console.log('⚠️ [Interceptor] SEM token ou é /assets');
      }
      
      console.log('🚀 [Interceptor] Chamando next() com request final');
      // Continua o fluxo e adiciona o tratamento de erro.
      return next(request).pipe(
        catchError((err: any): Observable<HttpEvent<any>> => {
          console.error('❌❌❌ [Interceptor] ERRO CAPTURADO!', err);
          if (err instanceof HttpErrorResponse) {
            console.error('❌ [Interceptor] É HttpErrorResponse. Status:', err.status);
            
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
