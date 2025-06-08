import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Atm } from '../types/atm.interface';
import { AtmQueryParams, AtmService } from '../services/atms.service';

@Component({
  selector: 'app-atms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atms.component.html',
  styleUrl: './atms.component.css'
})
export class AtmsComponent implements OnInit {
  atms: Atm[] = [];
  loading: boolean = true;
  error: string | null = null;

  newAtmType: string = '';
  newAtmAddress: string = '';
  newAtmCoordE: number | null = null;
  newAtmCoordN: number | null = null;

  filterType: string = '';
  filterAddress: string = '';

  isAdmin: boolean = false;

  editingAtmId: number | null = null;
  editAtmType: string = '';
  editAtmAddress: string = '';
  editAtmCoordE: number | null = null;
  editAtmCoordN: number | null = null;

  @Output() atmSelected = new EventEmitter<{ E: number; N: number }>();

  constructor(private atmService: AtmService) { }

  ngOnInit(): void {
    this.checkAdminStatus();
    this.fetchAtms();
  }

  checkAdminStatus(): void {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        this.isAdmin = payload.role === 'admin';
      } catch (e) {
        console.error('Greška pri dekodiranju tokena ili neispravan token:', e);
        this.isAdmin = false;
      }
    } else {
      this.isAdmin = false;
    }
  }

  fetchAtms(): void {
    this.loading = true;
    this.error = null;

    const queryParams: AtmQueryParams = {
      type: this.filterType,
      address: this.filterAddress
    };

    this.atmService.getAtms(queryParams).subscribe({
      next: (data: Atm[]) => {
        this.atms = data;
        this.loading = false;
        console.log('Bankomati uspješno dohvaćeni:', this.atms);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Greška pri dohvaćanju bankomata. Provjerite konzolu za više detalja.';
        console.error('Došlo je do greške:', err);
      }
    });
  }

  searchAtms(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.fetchAtms();
  }

  resetFilters(): void {
    this.filterType = '';
    this.filterAddress = '';
    this.fetchAtms();
  }

  addAtm(): void {
    if (!this.newAtmType || !this.newAtmAddress || this.newAtmCoordE === null || this.newAtmCoordN === null) {
      alert('Molimo popunite sva polja za novi bankomat.');
      return;
    }

    const newAtm = {
      type: this.newAtmType,
      address: this.newAtmAddress,
      coordinate_e: this.newAtmCoordE,
      coordinate_n: this.newAtmCoordN
    };

    this.atmService.addAtm(newAtm).subscribe({
      next: (response) => {
        console.log('Bankomat uspješno dodan:', response.atm);
        this.fetchAtms();
        this.newAtmType = '';
        this.newAtmAddress = '';
        this.newAtmCoordE = null;
        this.newAtmCoordN = null;
        alert('Bankomat uspješno dodan!');
      },
      error: (err) => {
        console.error('Greška pri dodavanju bankomata:', err);
        alert('Greška pri dodavanju bankomata: ' + (err.error?.message || err.message));
      }
    });
  }

  deleteAtm(id: number): void {
    if (confirm('Jeste li sigurni da želite obrisati ovaj bankomat?')) {
      this.atmService.deleteAtm(id).subscribe({
        next: () => {
          console.log(`Bankomat s ID: ${id} obrisan.`);
          this.fetchAtms();
          alert('Bankomat uspješno obrisan!');
        },
        error: (err) => {
          console.error(`Greška pri brisanju bankomata s ID: ${id}:`, err);
          alert('Greška pri brisanju bankomata: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  editAtm(atm: Atm): void {
    this.editingAtmId = atm.id;
    this.editAtmType = atm.type;
    this.editAtmAddress = atm.address;
    this.editAtmCoordE = atm.coordinates ? atm.coordinates.E : null;
    this.editAtmCoordN = atm.coordinates ? atm.coordinates.N : null;
  }

  // New method to save changes
  saveEdit(atm: Atm): void {
    if (!this.editAtmType || !this.editAtmAddress || this.editAtmCoordE === null || this.editAtmCoordN === null) {
      alert('Molimo popunite sva polja za uređivanje bankomata.');
      return;
    }

    const updateData = {
      type: this.editAtmType,
      address: this.editAtmAddress,
      coordinate_e: this.editAtmCoordE,
      coordinate_n: this.editAtmCoordN
    };

    this.atmService.updateAtm(atm.id, updateData).subscribe({
      next: (response) => {
        console.log('Bankomat uspješno ažuriran:', response.atm);
        this.fetchAtms(); // Refresh the list
        this.cancelEdit(); // Exit editing mode
        alert('Bankomat uspješno ažuriran!');
      },
      error: (err) => {
        console.error('Greška pri ažuriranju bankomata:', err);
        alert('Greška pri ažuriranju bankomata: ' + (err.error?.message || err.message));
      }
    });
  }

  cancelEdit(): void {
    this.editingAtmId = null;
    this.editAtmType = '';
    this.editAtmAddress = '';
    this.editAtmCoordE = null;
    this.editAtmCoordN = null;
  }

  onRowClick(atm: Atm): void {
    if (atm.coordinates) {
      this.atmSelected.emit(atm.coordinates);
      console.log('ATM odabran, koordinate:', atm.coordinates);
    } else {
      console.warn('ATM nema definirane koordinate.');
    }
  }
}