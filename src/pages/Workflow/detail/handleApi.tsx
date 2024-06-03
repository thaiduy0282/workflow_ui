import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import nodeConfigurationService from "../../../services/nodeConfiguration.service";

export const handleGetNodeConfigurationById = (id: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ["getNodeConfigurationById", { id }],
    queryFn: () => nodeConfigurationService.getNodeConfigurationById(id),
    staleTime: 3 * 3000,
  });
  return { isLoading, status, data, error };
};
