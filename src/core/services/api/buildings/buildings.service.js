import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
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
export const getAddressByCoordination = (lat, lon) =>
  apiClient(`https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`);

export const addBuildings = (body) => postParams("Building", body);
export const activeBuildings = (body) => putParams("Building/Active", body);
