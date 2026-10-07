export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

export interface NewEraProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  silhouette: string; // 'Visera Curva' | 'Visera Plana' | 'Trucker' | 'Básica Lisa'
  silhouetteCategory?: string;
  team: string; // Estilo, bordado o diseño
  league?: string;
  price: number;
  originalPrice?: number;
  promoText?: string; // e.g. "Combo 2 x Bs. 120"
  regulatorType?: string; // 'Broche Snapback' | 'Hebilla Metálica' | 'Correa de Tela' | 'Velcro'
  sinImpuestos: number;
  cuotasAmount: number;
  cuotasText: string;
  freeShipping?: boolean;
  isSoldOut?: boolean;
  isNew?: boolean;
  images: string[];
  colors: ColorOption[];
  sizes: string[]; // ['Unitalla Ajustable']
  rating: number;
  reviewCount: number;
  description: string;
  stock?: number;
  costPrice?: number;
  isActive?: boolean;
}

export interface CartItem {
  product: NewEraProduct;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}
