import { UserFavoriteRestaurant } from "@prisma/client";

export const isRestaurantFavorited = (
  restaurantId: string,
  userFavoritesRestaurants: UserFavoriteRestaurant[],
) => userFavoritesRestaurants.some((fav) => fav.restaurantId === restaurantId);
