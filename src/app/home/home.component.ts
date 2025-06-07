import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { AtmsComponent } from '../atms/atms.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent, AtmsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'maps';

  selectedAtmCoordinates: { E: number; N: number } | null = null;

  // Metoda koja se poziva kada AtmsComponent emituje 'atmSelected' događaj
  onAtmSelected(coordinates: { E: number; N: number }): void {
    this.selectedAtmCoordinates = coordinates;
    console.log('Primljene koordinate u AppComponent:', this.selectedAtmCoordinates);
  }
}
