import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Coordinates {
  E: number;
  N: number;
}

export interface Atm {
  id: number;
  type: string;
  address: string;
  coordinates: Coordinates;
}

export interface AtmQueryParams {
  type?: string;
  address?: string;
 
}

@Injectable({
  providedIn: 'root'
})
export class AtmService {
  private apiUrl = 'http://localhost:3000/atms'; 

  constructor(private http: HttpClient) { }

 
  getAtms(params?: AtmQueryParams): Observable<Atm[]> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.type) {
        httpParams = httpParams.set('type', params.type);
      }
      if (params.address) {
        httpParams = httpParams.set('address', params.address);
      }
   
    }


    return this.http.get<Atm[]>(this.apiUrl, { params: httpParams });
  }


  addAtm(newAtmData: { type: string; address: string; coordinate_e: number; coordinate_n: number; }): Observable<{ message: string, atm: Atm }> {
   
    return this.http.post<{ message: string, atm: Atm }>(this.apiUrl, newAtmData);
  }


  updateAtm(id: number, updateData: Partial<{ type: string; address: string; coordinate_e: number; coordinate_n: number; }>): Observable<{ message: string, atm: Atm }> {
    
    const payload: any = { ...updateData };

    return this.http.put<{ message: string, atm: Atm }>(`${this.apiUrl}/${id}`, payload);
  }


  deleteAtm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}