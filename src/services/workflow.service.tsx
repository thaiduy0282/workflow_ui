import axiosWorkflow from "../utils/AxiosWorkflow";

const workflowService = {
  getWorkflow(page: number, size: number) {
    const url = "/workflow";
    return axiosWorkflow.get(url, {
      params: {
        page: page || 0,
        size: size || 10,
      },
    });
  },

  getWorkflowById(id: string) {
    const url = "/workflow/" + id;
    return axiosWorkflow.get(url);
  },

  createWorkflow(data: any) {
    const url = `/workflow`;
    return axiosWorkflow.post(url, data);
  },

  updateWorkflow(data: any) {
    const url = `/workflow/${data.id}`;
    return axiosWorkflow.patch(url, data);
  },

  deleteWorkflow(id: string) {
    const url = `/workflow/${id}`;
    return axiosWorkflow.delete(url, {});
  },
};

export default workflowService;
