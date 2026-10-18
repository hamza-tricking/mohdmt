"use client";

import { useState } from "react";
import { fileUrl } from "@/lib/api";
import { formatDA } from "@/constants/site";

export default function ProductCard({ product, onOrder }) {
  const [colorIdx, setColorIdx] = useState(0);
  const color = product.colors[colorIdx];

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition-shadow hover:shadow-xl">
      <div className="relative aspect-[4/5] bg-pink-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={color.image}
          src={fileUrl(color.image)}
          alt={`${product.nameAr} - ${color.name}`}
          className="animate-pop h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl font-extrabold">
            {product.nameAr} <span className="text-sm font-medium text-neutral-400" dir="ltr">— {product.name}</span>
          </h3>
          <span className="whitespace-nowrap text-lg font-extrabold text-pink-500">
            {formatDA(product.price)}
          </span>
        </div>

        <p className="text-sm leading-7 text-neutral-600">{product.description}</p>

        <div>
          <p className="mb-2 text-sm font-bold">
            اللون: <span className="font-medium text-neutral-500">{color.name}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColorIdx(i)}
                title={c.name}
                aria-label={c.name}
                aria-pressed={i === colorIdx}
                style={{ backgroundColor: c.hex }}
                className={`h-9 w-9 rounded-full border-2 border-white shadow ring-2 transition-transform ${
                  i === colorIdx ? "scale-110 ring-ink" : "ring-pink-200"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOrder(product, color)}
          className="mt-auto rounded-full bg-ink py-3 text-base font-bold text-white transition-colors hover:bg-pink-500"
        >
          اطلب الآن
        </button>
      </div>
    </article>
  );
}
