export interface Atm {
  id: number; 
  type: string;
  address: string; 
  coordinates?: { 
    E: number; 
    N: number; 
  };
}