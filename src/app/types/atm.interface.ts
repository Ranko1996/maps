export interface Atm {
  id: number; 
//   type: 'Beskontaktni' | 'Uplatno-isplatni' | 'Dnevno-noćni trezor' | 'Kovinomat'; 
  type: string;
  address: string; 
  coordinates?: { 
    E: number; 
    N: number; 
  };
}