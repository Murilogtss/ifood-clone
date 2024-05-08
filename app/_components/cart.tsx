import { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createOrder } from "../_actions/order";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const Cart = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { products, subtotalPrice, totalPrice, totalDiscounts, clearCart } =
    useContext(CartContext);

  const { data } = useSession();

  const handleFinishOrderOnClick = async () => {
    if (!data?.user) return;
    const restaurant = products[0].restaurant;

    try {
      setIsSubmitLoading(true);
      await createOrder({
        subtotalPrice,
        totalDiscounts,
        totalPrice: totalPrice + Number(restaurant.deliveryFee),
        deliveryFee: restaurant.deliveryFee,
        deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: { id: restaurant.id },
        },
        status: OrderStatus.CONFIRMED,
        user: {
          connect: { id: data.user.id },
        },
        products: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });
      clearCart();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col py-5">
        {products.length ? (
          <>
            <div className="flex-auto space-y-2">
              {products.map((product) => (
                <CartItem cartProduct={product} key={product.id} />
              ))}
            </div>

            <div className="mt-6">
              <Card>
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotalPrice)}</span>
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Descontos</span>
                    <span>- {formatCurrency(totalDiscounts)}</span>
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Entrega</span>
                    {Number(products[0].restaurant.deliveryFee) === 0 ? (
                      <span className="text-primary uppercase">Grátis</span>
                    ) : (
                      <span>
                        {formatCurrency(
                          Number(products[0].restaurant.deliveryFee),
                        )}
                      </span>
                    )}
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Total</span>
                    {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                      <span>{formatCurrency(totalPrice)}</span>
                    ) : (
                      <span>
                        {formatCurrency(
                          Number(products?.[0].restaurant.deliveryFee) +
                            totalPrice,
                        )}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              className="mt-6 w-full"
              onClick={() => setIsConfirmDialogOpen(true)}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar Pedido
            </Button>
          </>
        ) : (
          <span className="font-medium">Sua sacola está vazia.</span>
        )}
      </div>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent className="z-50">
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja finalizar seu pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao finalizar o pedido você concorda com os termos e condições da
              nossa plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishOrderOnClick}
              disabled={isSubmitLoading}
            >
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Cart;
