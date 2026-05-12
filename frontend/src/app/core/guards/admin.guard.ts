import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('Authorization');
  if (!token) { router.navigate(['login']); return false; }

  try {
    // JWT payload is the middle part, base64 encoded
    const payload = JSON.parse(atob(token.replace('Bearer ', '').split('.')[1]));
    if (payload.role === 'admin') return true;
  } catch {}

  router.navigate(['home']);
  return false;
};