import metadataService from "../../services/metadata.service";
import { useQuery } from "@tanstack/react-query";

export const handleGetMetadata = () => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ["getMetadata", {}],
    queryFn: () => metadataService.getMetadata(),
    staleTime: 3 * 3000,
  });
  return { isLoading, status, data, error };
};
