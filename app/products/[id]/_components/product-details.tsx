"use client";

import DiscountBadge from "@/app/_components/discount-badge";
import ProductList from "@/app/_components/product-list";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import {
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ProductDetailsProps = {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  extraProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
};

const ProductDetails = ({ product, extraProducts }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantityOnClick = () => setQuantity((prev) => prev + 1);
  const handleDecreaseQuantityOnClick = () =>
    setQuantity((prev) => {
      if (prev <= 1) return 1;

      return prev - 1;
    });

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-tl-3xl rounded-tr-3xl bg-white py-5">
      {/*Restaurant*/}
      <div className="flex items-center gap-[0.375rem] px-5">
        <div className="relative h-6 w-6">
          <Image
            src={product.restaurant.imageUrl}
            alt={product.restaurant.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-muted-foreground text-xs">
          {product.restaurant.name}
        </span>
      </div>

      {/*Produto*/}
      <h1 className="mb-2 mt-1 px-5 text-xl font-semibold">{product.name}</h1>

      {/*Preço e Quantidade*/}
      <div className="flex justify-between px-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {formatCurrency(calculateProductTotalPrice(product))}
            </h2>
            {product.discountPercentage && <DiscountBadge product={product} />}
          </div>
          {product.discountPercentage > 0 && (
            <p className="text-muted-foreground text-sm">
              De {formatCurrency(Number(product.price))}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="border-muted-foreground border border-solid"
            onClick={handleDecreaseQuantityOnClick}
            disabled={quantity === 1}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="w-4 text-center">{quantity}</span>
          <Button size="icon" onClick={handleIncreaseQuantityOnClick}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {/* Dados da Entrega */}
      <div className="px-5">
        <Card className="mt-6 flex justify-around  py-3">
          <div className="flex flex-col items-center">
            <div className="text-muted-foreground flex items-center gap-2">
              <span className="text-xs">Entrega</span>
              <BikeIcon size={14} />
            </div>

            {Number(product.restaurant.deliveryFee) > 0 ? (
              <p className="text-xs font-semibold">
                {formatCurrency(Number(product.restaurant.deliveryFee))}
              </p>
            ) : (
              <p className="text-xs font-semibold">Grátis</p>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="text-muted-foreground flex items-center gap-2">
              <span className="text-xs">Entrega</span>
              <TimerIcon size={14} />
            </div>

            <p className="text-xs font-semibold">
              {product.restaurant.deliveryTimeMinutes} min
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 space-y-3 px-5">
        <h3 className="font-semibold">Sobre</h3>
        <p className="text-muted-foreground text-sm">{product.description}</p>
      </div>

      <div className="mt-6 space-y-3 ">
        <h3 className="px-5 font-semibold">Sucos</h3>
        <ProductList products={extraProducts} />
      </div>

      <div className="mt-6 px-5">
        <Button className="w-full font-semibold">Adicionar a Sacola</Button>
      </div>
    </div>
  );
};

export default ProductDetails;
