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

export const handleSaveNodeConfigurationById = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["saveNodeConfigurationById"],
    mutationFn: ({ id, data }: any) =>
      nodeConfigurationService.saveNodeConfigurationById(id, data),
    onError: (error: any) => {
      // if (error.response && error.response.data.data) {
      //   handleNotificationMessege(error?.response?.data?.data)
      // } else {
      //   handleNotificationMessege(error.message)
      // }
    },
    onSuccess: (data: any) => {
      onSuccess();
    },
  });
  return {
    mutateSaveNodeConfig: mutate,
    isPendingSaveNodeConfig: isPending,
    isSuccessSaveNodeConfig: isSuccess,
  };
};
