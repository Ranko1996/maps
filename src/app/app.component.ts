import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AtmsComponent } from "./atms/atms.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponent, AtmsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'maps';

  selectedAtmCoordinates: { E: number; N: number } | null = null;

  // Metoda koja se poziva kada AtmsComponent emituje 'atmSelected' događaj
  onAtmSelected(coordinates: { E: number; N: number }): void {
    this.selectedAtmCoordinates = coordinates;
    console.log('Primljene koordinate u AppComponent:', this.selectedAtmCoordinates);
  }
}
