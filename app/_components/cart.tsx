import { useContext } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const Cart = () => {
  const { products, subtotalPrice, totalPrice, totalDiscounts } =
    useContext(CartContext);

  return (
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

          <Button className="mt-6 w-full">Finalizar Pedido</Button>
        </>
      ) : (
        <span className="font-medium">Sua sacola está vazia.</span>
      )}
    </div>
  );
};

export default Cart;
