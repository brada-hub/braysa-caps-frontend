'use client';

import React, { useState, useEffect, useMemo } from 'react';
import NewEraHeader from '@/components/newera/NewEraHeader';
import NewEraSlideshow from '@/components/newera/NewEraSlideshow';
import NewEraCollectionTabs from '@/components/newera/NewEraCollectionTabs';
import NewEraMarquee from '@/components/newera/NewEraMarquee';
import NewEraPopularCarousel from '@/components/newera/NewEraPopularCarousel';
import NewEraFooter from '@/components/newera/NewEraFooter';
import NewEraCartDrawer from '@/components/newera/NewEraCartDrawer';
import NewEraProductModal from '@/components/newera/NewEraProductModal';
import NewEraRewardsModal from '@/components/newera/NewEraRewardsModal';
import {
  INITIAL_NEW_ERA_PRODUCTS,
  POPULAR_PRODUCTS,
} from '@/components/newera/productsData';
import { NewEraProduct, CartItem } from '@/components/newera/types';

const TENANT_ID = 'e9b1b369-2f22-443b-b236-4767117f7eb0';
const STORE_WHATSAPP_NUMBER = '59167544099'; // Bolivia (+591 67544099)

export default function StorefrontPage() {
  const [products, setProducts] = useState<NewEraProduct[]>(INITIAL_NEW_ERA_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);

  // Quick view / Product Modal
  const [activeModalProduct, setActiveModalProduct] = useState<NewEraProduct | null>(null);
  const [modalInitialColor, setModalInitialColor] = useState<string | undefined>(undefined);

  // Sync with local inventory configuration & live updates
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const stored = localStorage.getItem('braysa_caps_inventory');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts((prev) => {
              const updatedExisting = prev
                .filter((p) => {
                  const found = parsed.find((i: any) => i.id === p.id || i.sku === p.sku);
                  return found ? found.isActive !== false : true;
                })
                .map((p) => {
                  const found = parsed.find((i: any) => i.id === p.id || i.sku === p.sku);
                  if (found) {
                    const currentStock = Number(found.currentStock ?? 10);
                    const salePrice = Number(found.salePrice ?? p.price);
                    return {
                      ...p,
                      name: found.name || p.name,
                      silhouette: found.silhouette || p.silhouette,
                      team: found.team || p.team,
                      images: found.images && found.images.length > 0 ? found.images : p.images,
                      price: salePrice,
                      isSoldOut: currentStock <= 0,
                      stock: currentStock,
                      isNew: found.isNew !== undefined ? found.isNew : p.isNew,
                      freeShipping: found.freeShipping !== undefined ? found.freeShipping : p.freeShipping,
                      sizes: found.sizes && found.sizes.length > 0 ? found.sizes : p.sizes,
                      sinImpuestos: salePrice,
                      cuotasAmount: Math.round(salePrice / 2),
                    };
                  }
                  return p;
                });

              // Include newly created custom products from inventory manager
              const newCustomItems: NewEraProduct[] = parsed
                .filter(
                  (item: any) =>
                    !prev.some((p) => p.id === item.id || p.sku === item.sku) &&
                    item.isActive !== false
                )
                .map((item: any) => ({
                  id: item.id,
                  sku: item.sku,
                  name: item.name,
                  brand: item.brand || 'BRAYSA CAPS',
                  silhouette: item.silhouette || 'Visera Curva',
                  silhouetteCategory: (item.silhouette as any) || 'Visera Curva',
                  team: item.team || 'BRAYSA Urbano',
                  league: 'URBANO',
                  price: Number(item.salePrice || 70),
                  sinImpuestos: Number(item.salePrice || 70),
                  cuotasAmount: Math.round(Number(item.salePrice || 70) / 2),
                  cuotasText: 'Disponible para entrega inmediata',
                  freeShipping: item.freeShipping ?? true,
                  isSoldOut: Number(item.currentStock) <= 0,
                  isNew: item.isNew ?? true,
                  images: item.images && item.images.length > 0 ? item.images : ['/cdn/p_yankees_1.jpg'],
                  colors: [{ name: item.color || 'Negro', hex: '#111111' }],
                  sizes: item.sizes && item.sizes.length > 0 ? item.sizes : ['Unitalla Ajustable'],
                  regulatorType: item.regulatorType || 'Hebilla / Broche Graduable',
                  rating: 5.0,
                  reviewCount: 12,
                  description: item.description || `Gorra streetwear con regulador graduable. Colección BRAYSA CAPS.`,
                  stock: Number(item.currentStock),
                  isActive: true,
                }));

              return [...newCustomItems, ...updatedExisting];
            });
          }
        }
      } catch {
        // Storage access safe
      }
    };

    syncFromStorage();
    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('braysa_inventory_updated', syncFromStorage);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('braysa_inventory_updated', syncFromStorage);
    };
  }, []);

  // Cart operations
  const handleAddToCart = (
    product: NewEraProduct,
    selectedColor: string,
    selectedSize: string,
    quantity: number
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, selectedColor, selectedSize, quantity }];
    });

    setIsCartOpen(true);
  };

  const handleAddToCartDirect = (product: NewEraProduct) => {
    handleAddToCart(
      product,
      product.colors[0]?.name || 'Original',
      product.sizes[0] || 'Único',
      1
    );
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle Wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Checkout handling via WhatsApp order & internal DB format
  const handleCheckout = () => {
    const lines = cartItems.map(
      (item) =>
        `• ${item.quantity}x ${item.product.name} (Talle: ${item.selectedSize}, Color: ${item.selectedColor}) - Bs. ${Math.round(
          item.product.price * item.quantity
        ).toLocaleString('es-BO')}`
    );
    const subtotal = cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

    const message = `¡Hola BRAYSA CAPS! 👋 Quisiera concretar mi pedido de la tienda:\n\n${lines.join(
      '\n'
    )}\n\n*Total a pagar: Bs. ${Math.round(subtotal).toLocaleString('es-BO')}*\n\n¿Tienen disponibilidad para envío a domicilio en Bolivia? ¡Muchas gracias!`;

    const url = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleOpenProductModal = (product: NewEraProduct, initialColor?: string) => {
    setActiveModalProduct(product);
    setModalInitialColor(initialColor);
  };

  const cartTotalCount = useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
    [cartItems]
  );

  const popularProducts = useMemo(() => {
    return products.slice(0, 9);
  }, [products]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-black selection:text-white">
      {/* MAIN HEADER (STICKY + MEGA MENU + ACTIONS) */}
      <NewEraHeader
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsCartOpen(true)}
        products={products}
        onSelectProduct={(p) => handleOpenProductModal(p)}
        onSelectCategory={(cat) => {
          // Scroll to collection section
          document.getElementById('collection-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectTeam={(team) => {
          document.getElementById('collection-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. HERO SLIDESHOW */}
      <NewEraSlideshow
        onCtaClick={(tag) => {
          document.getElementById('collection-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. SILHOUETTES COLLECTION TABS ("Gorras New Era") */}
      <div id="collection-tabs-section">
        <NewEraCollectionTabs
          products={products}
          onSelectProduct={handleOpenProductModal}
          onAddToCartDirect={handleAddToCartDirect}
          onViewAllSilhouette={(sil) => {
            console.log('View all silhouette:', sil);
          }}
        />
      </div>

      {/* 5. MARQUEE TICKER (REWARDS) */}
      <NewEraMarquee onJoinClick={() => setIsRewardsModalOpen(true)} />


      {/* 7. POPULAR PRODUCTS CAROUSEL ("Gorras más populares") */}
      <div id="popular-section">
        <NewEraPopularCarousel
          products={popularProducts}
          onSelectProduct={handleOpenProductModal}
          onAddToCartDirect={handleAddToCartDirect}
          onViewAll={() => {
            document.getElementById('collection-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>


      {/* 9. AUTHENTIC 5-COLUMN FOOTER & SUB-FOOTER */}
      <NewEraFooter
        onNavClick={(target) => {
          if (target === 'Rewards') {
            setIsRewardsModalOpen(true);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* 10. INTERACTIVE CART DRAWER */}
      <NewEraCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* 11. QUICK VIEW / PRODUCT OPTIONS MODAL */}
      <NewEraProductModal
        product={activeModalProduct}
        initialColor={modalInitialColor}
        onClose={() => setActiveModalProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 12. REWARDS VIP MODAL */}
      <NewEraRewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
      />
    </div>
  );
}
