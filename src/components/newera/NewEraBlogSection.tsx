'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from './productsData';

interface NewEraBlogSectionProps {
  onPostClick?: (slug: string) => void;
}

export default function NewEraBlogSection({ onPostClick }: NewEraBlogSectionProps) {
  return (
    <section className="py-12 md:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-neutral-400">
              Noticias & Guías de Estilo
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight uppercase text-black font-sans mt-0.5">
              Blog
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onPostClick && onPostClick('all')}
            className="text-xs font-bold uppercase tracking-widest text-black hover:text-neutral-500 transition-colors border-b border-black pb-0.5 flex items-center gap-1 cursor-pointer"
          >
            Ver todo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="flex flex-col group cursor-pointer"
              onClick={() => onPostClick && onPostClick(post.slug)}
            >
              {/* Featured Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-neutral-100 mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Meta Date */}
              <time className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                {post.date}
              </time>

              {/* Title */}
              <h3 className="text-base font-bold text-neutral-900 leading-snug group-hover:text-black transition-colors mb-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                {post.excerpt}
              </p>

              {/* Read More Link */}
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black group-hover:underline">
                  Leer más <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
