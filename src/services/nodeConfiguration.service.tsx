import axiosWorkflow from "../utils/AxiosWorkflow";

const nodeConfigurationService = {
  getNodeConfigurationById(id: string) {
    const url = "/node-configuration/" + id;
    return axiosWorkflow.get(url);
  },

  saveNodeConfigurationById(id: string, data: any) {
    const url = "/node-configuration/" + id;
    return axiosWorkflow.post(url, data);
  },
};

export default nodeConfigurationService;
