"use client";

import { Button } from "@/app/_components/ui/button";
import { isRestaurantFavorited } from "@/app/_helpers/restaurant";
import { userToggleFavoriteRestaurant } from "@/app/_hooks/user-toggle-favorite-restaurant";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { ChevronLeftIcon, HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type RestaurantImageProps = {
  restaurant: Pick<Restaurant, "id" | "name" | "imageUrl">;
  userFavoriteRestaurants: UserFavoriteRestaurant[];
};

const RestaurantImage = ({
  restaurant,
  userFavoriteRestaurants,
}: RestaurantImageProps) => {
  const router = useRouter();
  const { data } = useSession();
  const isFavorited = isRestaurantFavorited(
    restaurant.id,
    userFavoriteRestaurants,
  );

  const { handleFavoriteClick } = userToggleFavoriteRestaurant({
    restaurantId: restaurant.id,
    userId: data?.user.id,
    restaurantIsCurrentlyFavorited: isFavorited,
  });

  const handleBackClick = () => router.back();

  return (
    <div className="relative h-[250px] w-full">
      <Image
        src={restaurant.imageUrl}
        alt={restaurant.name}
        fill
        className="object-cover"
      />
      <Button
        className="text-foreground absolute left-4 top-4 rounded-full bg-white hover:text-white"
        size="icon"
        onClick={handleBackClick}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size="icon"
        className={`absolute right-4 top-4 rounded-full bg-gray-700 ${isFavorited && "bg-primary"}`}
        onClick={handleFavoriteClick}
      >
        <HeartIcon size={20} className="fill-white" />
      </Button>
    </div>
  );
};

export default RestaurantImage;
