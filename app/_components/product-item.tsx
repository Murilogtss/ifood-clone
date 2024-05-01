import { Prisma } from "@prisma/client";
import Image from "next/image";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { ArrowDownIcon } from "lucide-react";

type productItemProps = {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
        };
      };
    };
  }>;
};

const ProductItem = ({ product }: productItemProps) => {
  return (
    <div className="w-[150px] min-w-[150px] space-y-2">
      <div className="relative h-[150px] w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="rounded-sm object-cover shadow-sm"
        />
        {product.discountPercentage && (
          <div className="bg-primary absolute left-2 top-2 flex items-center gap-[2px] rounded-full px-2 py-[2px] text-xs font-semibold text-white">
            <ArrowDownIcon size={12} />
            <span>{product.discountPercentage}%</span>
          </div>
        )}
      </div>
      <div>
        <h2 className="truncate text-sm">{product.name}</h2>
        <div className="flex items-center gap-1">
          <h3 className="font-semibold">
            {formatCurrency(calculateProductTotalPrice(product))}
          </h3>
          {product.discountPercentage > 0 && (
            <span className="text-muted-foreground text-xs line-through">
              {formatCurrency(Number(product.price))}
            </span>
          )}
        </div>
        <span className="text-muted-foreground block text-xs">
          {product.restaurant.name}
        </span>
      </div>
    </div>
  );
};

export default ProductItem;
