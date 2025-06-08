
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router);        

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        if (state.url !== '/login') {
          router.navigate(['/login']);
        }
        return false;
      }
      else {
        if (state.url === '/login') {
          router.navigate(['/home']); 
          return false; 
        }
        return true; 
      }
    })
  );
};