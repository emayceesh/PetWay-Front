import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core'; 
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { meuhttpInterceptor } from './auth/http-interceptor.service';

// --- IMPORTS KEYCLOAK (COMPATÍVEIS com v16.x) ---
// Removemos a função 'provideKeycloak'
import { KeycloakService } from 'keycloak-angular'; 
import { initializeKeycloak } from './auth/keycloak-init'; // Precisamos desta função
// ------------------------------------------------------

// Instância global do KeycloakService (necessário para o APP_INITIALIZER)
const keycloakService = new KeycloakService(); 


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimations(), 
    
    // Seu interceptor customizado
    provideHttpClient(withInterceptors([meuhttpInterceptor])),

    // 1. REGISTRA O SERVIÇO KEYCLOAK para injeção em outros componentes
    {
      provide: KeycloakService,
      useValue: keycloakService,
    },
    
    // 2. CONFIGURAÇÃO KEYCLOAK (Padrão antigo: usa a factory initializeKeycloak)
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true, 
      deps: [KeycloakService],
    }
  ]
};
