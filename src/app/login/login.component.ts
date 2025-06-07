import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { HttpErrorResponse } from '@angular/common/http'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit { 
  username = '';
  password = '';
  loginMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/home']); 
      }
    });
  }

  onLogin(): void {
    this.loginMessage = ''; 

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        this.loginMessage = 'Prijava uspješna!';
        this.username = ''; 
        this.password = '';
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.loginMessage = 'Neispravno korisničko ime ili lozinka.';
        } else {
          this.loginMessage = error.error || 'Došlo je do greške prilikom prijave.';
        }
        console.error('Greška pri prijavi:', error);
      }
    });
  }
}