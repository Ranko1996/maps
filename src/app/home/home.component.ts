import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { AtmsComponent } from '../atms/atms.component'; 
import { MapComponent } from '../map/map.component';   
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    AtmsComponent,
    MapComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedAtmCoordinates: { E: number; N: number } | null = null;
  username: string | null = null; 

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsername(); 
  }

  loadUsername(): void {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        this.username = payload.username || 'Korisnik';
      } catch (e) {
        console.error('Greška pri dekodiranju tokena ili neispravan token:', e);
        this.username = 'Nepoznat korisnik';
      }
    } else {
      this.username = 'Gost';
    }
  }

  onAtmSelected(coordinates: { E: number; N: number }): void {
    this.selectedAtmCoordinates = coordinates;
  }

  // onLogout(): void {
  //   localStorage.removeItem('accessToken');
  //   this.router.navigate(['/login']); // Preusmjeri na stranicu za prijavu
  // }
   onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Logika nakon uspješne odjave: preusmjeravanje na login stranicu
        console.log('Uspješno odjavljen s Home stranice.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Rukovanje greškama pri odjavi (npr. ako backend ne odgovori)
        console.error('Greška pri odjavi:', error);
        // I dalje preusmjeri na login, jer su tokeni vjerojatno lokalno obrisani
        this.router.navigate(['/login']); 
      }
    });
  }
}