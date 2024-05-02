import { Product } from "@prisma/client";
import { ArrowDownIcon } from "lucide-react";

type DiscountBadgeProps = {
  product: Pick<Product, "discountPercentage">;
};

const DiscountBadge = ({ product }: DiscountBadgeProps) => {
  return (
    <div className="bg-primary left-2 top-2 flex items-center gap-[2px] rounded-full px-2 py-[2px] text-xs font-semibold text-white">
      <ArrowDownIcon size={12} />
      <span>{product.discountPercentage}%</span>
    </div>
  );
};

export default DiscountBadge;
