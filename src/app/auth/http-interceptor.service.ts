import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const meuhttpInterceptor: HttpInterceptorFn = (request, next) => {

  let router = inject(Router);

  let token = localStorage.getItem('token');
  
  console.log('Role autorizada!');
  if (token && !router.url.includes('/login')) {
    request = request.clone({
      setHeaders: { Authorization: 'Bearer ' + token },
    });
  }

  return next(request).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        console.log('Não deu boa amigão!!');
        
        if (err.status === 401) {
          alert('ERROR 401 - Acesso não autorizado ou expirado!');
          router.navigate(['/admin/dashboard']);
        } else
        if (err.status === 403) {
          alert('ERROR 403 - Usuário sem permissão!');
          router.navigate(['/admin/dashboard']);
        } else {
          console.error('HTTP error:', err);
        }


      } else {
        console.error('An error occurred:', err);
      }

      return throwError(() => err);
    })
  );
};
