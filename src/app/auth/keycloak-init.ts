import { KeycloakService } from 'keycloak-angular';

// Função de inicialização do Keycloak
export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        // Porta e Realm: 5001 e petway (configuração correta)
        url: 'http://localhost:5001',
        realm: 'petway',
        clientId: 'petway-frontend',
      },
      initOptions: {
        // Ação a ser tomada no carregamento: forçar login se o usuário não estiver autenticado.
        onLoad: 'login-required', 
        
        // --- CORREÇÃO DE ERROS DE TIMEOUT/404 ---
        
        // 1. Desabilita a checagem silenciosa (silent check).
        // Isso resolve o "Timeout when waiting for 3rd party check iframe message."
        // Também resolve indiretamente muitos problemas de inicialização em navegadores modernos.
        checkLoginIframe: false, 

        // NOTA: A propriedade 'check3pCookiesSupported' foi removida para resolver o erro de tipagem (ts(2353)).
      },
      // Configurações para o Interceptor HTTP (geralmente não são alteradas aqui)
      bearerExcludedUrls: ['/assets'],
    });
}
