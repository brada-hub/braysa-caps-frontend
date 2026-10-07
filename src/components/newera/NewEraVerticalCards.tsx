'use client';

import React from 'react';

interface CardItem {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  actionTag: string;
}

const CARDS: CardItem[] = [
  {
    id: '59fifty',
    title: '59FIFTY',
    description: 'Un clásico de New Era que marcó generaciones con su estilo fitted y actitud única.',
    buttonText: 'Sumate al legado',
    actionTag: '59FIFTY',
    image: '/cdn/card_59fifty.webp',
  },
  {
    id: 'para-ella',
    title: 'Para ella',
    description: 'Looks versátiles, colores únicos y la calidad de siempre.',
    buttonText: 'Conocé más',
    actionTag: 'CURVAS (BASEBALL)',
    image: '/cdn/card_mujer.png',
  },
  {
    id: 'accesorios',
    title: 'Accesorios',
    description: 'Pines exclusivos para complementar tus prendas.',
    buttonText: 'Ver colección',
    actionTag: 'ACCESORIOS',
    image: '/cdn/card_accesorios.webp',
  },
  {
    id: 'tiendas',
    title: 'Tiendas',
    description: 'Visitá nuestros locales y llevate una New Era que hable por vos.',
    buttonText: 'Conocer tiendas',
    actionTag: 'TIENDAS',
    image: '/cdn/card_tiendas.webp',
  },
];

interface NewEraVerticalCardsProps {
  onCardClick?: (actionTag: string) => void;
}

export default function NewEraVerticalCards({ onCardClick }: NewEraVerticalCardsProps) {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className="relative h-[480px] sm:h-[540px] rounded-sm overflow-hidden group shadow-xs flex flex-col justify-end p-6 select-none cursor-pointer"
              onClick={() => onCardClick && onCardClick(card.actionTag)}
            >
              {/* Card Image */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Shadow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Text & Button content */}
              <div className="relative z-10 text-white space-y-3">
                <h3 className="text-2xl font-bold tracking-tight uppercase font-sans">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-300 font-normal leading-relaxed line-clamp-2">
                  {card.description}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardClick && onCardClick(card.actionTag);
                    }}
                    className="inline-block bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-colors active:scale-95 cursor-pointer shadow-sm"
                  >
                    {card.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
