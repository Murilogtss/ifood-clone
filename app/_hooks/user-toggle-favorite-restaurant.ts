import { toast } from "sonner";
import {
  favoriteRestaurant,
  unfavoriteRestaurant,
} from "../_actions/restaurant";

type userToggleFavoriteRestaurantProps = {
  userId?: string;
  restaurantId: string;
  restaurantIsCurrentlyFavorited: boolean;
};

export const userToggleFavoriteRestaurant = ({
  userId,
  restaurantId,
  restaurantIsCurrentlyFavorited,
}: userToggleFavoriteRestaurantProps) => {
  const handleFavoriteClick = async () => {
    if (!userId) return;
    try {
      if (restaurantIsCurrentlyFavorited) {
        await unfavoriteRestaurant(userId, restaurantId);
        return toast.success("Restaurante removido dos favoritos!");
      } else {
        await favoriteRestaurant(userId, restaurantId);
        toast.success("Restaurante favoritado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao favoritar o restaurante.");
    }
  };

  return { handleFavoriteClick };
};
