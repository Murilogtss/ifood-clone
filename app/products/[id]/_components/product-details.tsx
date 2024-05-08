"use client";

import Cart from "@/app/_components/cart";
import DeliveryInfo from "@/app/_components/delivery-info";
import DiscountBadge from "@/app/_components/discount-badge";
import ProductList from "@/app/_components/product-list";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { CartContext } from "@/app/_context/cart";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  const { addProductToCart, products } = useContext(CartContext);
  console.log(products);

  const addToCart = ({ emptyCart }: { emptyCart?: boolean }) => {
    addProductToCart({ product, quantity, emptyCart });
    setIsCartOpen(true);
  };

  const handleAddToCartOnClick = () => {
    //Verificar se há produto de outro restaurant no carrinho
    const hasDifferentRestaurantProduct = products.some(
      (cartProduct) => cartProduct.restaurantId !== product.restaurantId,
    );
    //Se houver, mostrar aviso
    if (hasDifferentRestaurantProduct) {
      return setIsConfirmationDialogOpen(true);
    }

    addToCart({
      emptyCart: false,
    });
  };

  const handleIncreaseQuantityOnClick = () => setQuantity((prev) => prev + 1);
  const handleDecreaseQuantityOnClick = () =>
    setQuantity((prev) => {
      if (prev <= 1) return 1;

      return prev - 1;
    });

  return (
    <>
      <div className="relative z-30 mt-[-1.5rem] rounded-tl-3xl rounded-tr-3xl bg-white py-5">
        {/*Restaurant*/}
        <div className="flex items-center gap-[0.375rem] px-5">
          <div className="relative h-6 w-6">
            <Link href={`/restaurants/${product.restaurantId}`}>
              <Image
                src={product.restaurant.imageUrl}
                alt={product.restaurant.name}
                fill
                className="rounded-full object-cover"
              />
            </Link>
          </div>
          <Link href={`/restaurants/${product.restaurantId}`}>
            <span className="text-muted-foreground text-xs">
              {product.restaurant.name}
            </span>
          </Link>
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
              {product.discountPercentage && (
                <DiscountBadge product={product} />
              )}
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
          <DeliveryInfo restaurant={product.restaurant} />
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
          <Button
            className="w-full font-semibold"
            onClick={handleAddToCartOnClick}
          >
            Adicionar a Sacola
          </Button>
        </div>
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-[90vw]">
          <SheetHeader>
            <SheetTitle className="text-left">Sacola</SheetTitle>
          </SheetHeader>
          <Cart />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Notamos que sua sacola não está vazia
            </AlertDialogTitle>
            <AlertDialogDescription>
              Voce só pode adicionar itens de um restaurante por vez. Deseja
              mesmo adicionar este produto? Isso limpará sua sacola atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => addToCart({ emptyCart: true })}>
              Esvaziar sacola e Adicionar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDetails;
