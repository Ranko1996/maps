// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Označava servis kao singleton, dostupan u cijeloj aplikaciji
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; 
  
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasTokens());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  private hasTokens(): boolean {
    return !!localStorage.getItem(this.accessTokenKey) && !!localStorage.getItem(this.refreshTokenKey);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.accessTokenKey, response.accessToken);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);

        this.isAuthenticatedSubject.next(true); 
      }),
      catchError(error => {
        console.error('Greška pri prijavi:', error);
        this.clearTokens(); 
        throw error;
      })
    );
  }

 
  logout(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      return this.http.delete<any>(`${this.apiUrl}/logout`, { body: { token: refreshToken } }).pipe(

        tap(() => this.clearTokens()), 
        catchError(error => {
          console.error('Greška pri odjavi:', error);
          this.clearTokens(); 
          throw error;
        })
      );
    } else {
      this.clearTokens();
      return new Observable(observer => observer.complete()); 
    }
  }


  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      return new Observable(observer => observer.error('Nema refresh tokena za osvježavanje.'));
    }
    return this.http.post<any>(`${this.apiUrl}/token`, { token: refreshToken }).pipe(
      tap(response => {
        localStorage.setItem(this.accessTokenKey, response.accessToken);
      }),
      catchError(error => {
        console.error('Greška pri osvježavanju tokena:', error);
        this.clearTokens(); 
        throw error;
      })
    );
  }

 
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }


  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isAuthenticatedSubject.next(false);
  }
}