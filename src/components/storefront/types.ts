export interface CapProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  silhouette: 'SNAPBACK' | 'CURVA' | 'FITTED' | 'TRUCKER';
  silhouetteLabel: string;
  color: string;
  availableColors: { name: string; hex: string }[];
  price: number;
  stock: number;
  badge?: 'NUEVO' | 'MÁS VENDIDO' | 'EDICIÓN LIMITADA' | 'AGOTADO';
  colorHex: string;
  accentHex: string;
  teamLogo: string;
  teamName: string;
  description: string;
}

export type SilhouetteFilterType =
  | 'TODAS'
  | 'SNAPBACK (AJUSTABLE)'
  | 'CURVAS (BASEBALL)'
  | 'FITTED (CERRADA)'
  | 'TRUCKER (MALLA)';
