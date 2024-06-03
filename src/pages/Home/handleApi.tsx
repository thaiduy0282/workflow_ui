import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import workflowService from "../../services/workflow.service";

export const handleGetWorkflow = (page: number, size: number) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ["getWorkflow", { page, size }],
    queryFn: () => workflowService.getWorkflow(page, size),
    staleTime: 3 * 3000,
  });
  return { isLoading, status, data, error };
};

export const handleGetWorkflowById = (id: string) => {
  const { isLoading, status, data, error } = useQuery({
    queryKey: ["getWorkflowById", { id }],
    queryFn: () => workflowService.getWorkflowById(id),
    staleTime: 3 * 3000,
  });
  return { isLoading, status, data, error };
};

export const handleCreateWorkflow = (
  onSuccess: (workflowId: string) => void
) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["createWorkflow"],
    mutationFn: (data: any) => workflowService.createWorkflow(data),
    onError: (error: any) => {
      // if (error.response && error.response.data.data) {
      //   handleNotificationMessege(error?.response?.data?.data)
      // } else {
      //   handleNotificationMessege(error.message)
      // }
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["getWorkflow"] });
      onSuccess(response.id);
    },
  });
  return { mutate, isPending, isSuccess };
};

export const handleUpdateWorkflow = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["updateWorkflow"],
    mutationFn: (data: any) => workflowService.updateWorkflow(data),
    onError: (error: any) => {
      // if (error.response && error.response.data.data) {
      //   handleNotificationMessege(error?.response?.data?.data)
      // } else {
      //   handleNotificationMessege(error.message)
      // }
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["getWorkflow"] });
      queryClient.invalidateQueries({
        queryKey: ["getWorkflowById", { id: data.id }],
      });

      onSuccess();
    },
  });
  return { mutate, isPending, isSuccess };
};

export const handleDeleteWorkflow = (id: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["deleteWorkflow"],
    mutationFn: () => workflowService.deleteWorkflow(id),
    onError: (error: any) => {
      // if (error.response && error.response.data.data) {
      //   handleNotificationMessege(error?.response?.data?.data)
      // } else {
      //   handleNotificationMessege(error.message)
      // }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getWorkflow"] });
    },
  });
  return { mutate, isPending, isSuccess };
};

export const handlePublishWorkflow = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["publishWorkflow"],
    mutationFn: (data: any) => workflowService.publishWorkflow(data),
    onError: (error: any) => {
      // if (error.response && error.response.data.data) {
      //   handleNotificationMessege(error?.response?.data?.data)
      // } else {
      //   handleNotificationMessege(error.message)
      // }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getWorkflow"] });
      onSuccess();
    },
  });
  return {
    mutatePublish: mutate,
    isPendingPublish: isPending,
    isSuccessPublish: isSuccess,
  };
};
