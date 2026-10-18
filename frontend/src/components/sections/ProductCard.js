"use client";

import { useState } from "react";
import { fileUrl } from "@/lib/api";
import { formatDA } from "@/constants/site";

export default function ProductCard({ product, unitPrice, onOrderNow, onAdd }) {
  const [colorIdx, setColorIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const color = product.colors[colorIdx];

  function add() {
    onAdd(product, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-pink-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={color.image}
          src={fileUrl(color.image)}
          alt={`${product.nameAr} - ${color.name}`}
          className="animate-pop h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute start-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold shadow">
          {color.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 text-center">
        <h3 className="text-lg font-extrabold">
          {product.nameAr}{" "}
          <span className="block text-xs font-medium text-neutral-400" dir="ltr">{product.name}</span>
        </h3>
        <p className="text-base font-extrabold text-pink-500">{formatDA(unitPrice)}</p>

        <div className="flex justify-center gap-2">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColorIdx(i)}
              title={c.name}
              aria-label={c.name}
              aria-pressed={i === colorIdx}
              style={{ backgroundColor: c.hex }}
              className={`h-7 w-7 rounded-full border-2 border-white shadow ring-2 transition-transform ${
                i === colorIdx ? "scale-110 ring-ink" : "ring-pink-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOrderNow(product, color)}
            className="rounded-full bg-pink-400 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-ink"
          >
            اطلب الآن
          </button>
          <button
            type="button"
            onClick={add}
            className="rounded-full border-2 border-ink py-2.5 text-sm font-bold transition-colors hover:bg-pink-100"
          >
            {added ? "تمت ✓" : "+ للسلة"}
          </button>
        </div>
      </div>
    </article>
  );
}
