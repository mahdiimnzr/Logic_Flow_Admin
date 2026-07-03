import useGetQueries from "../../common/useGetQueries";
import apiClient from "../../interceptor/interceptor.service";

export const useGetAddressByCoordination = (buildings, enabled) =>
  useGetQueries(
    buildings.map((value) => ({
      queryKey: `BuildingAddress-${value.id}`,
      pathUrl: `https://photon.komoot.io/reverse?lon=${value.longitude}&lat=${value.latitude}`,
      enabled,
    })),
  );
