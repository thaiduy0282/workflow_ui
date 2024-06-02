import axiosClient from "../utils/AxiosClient";

const metadataService = {
  getMetadata() {
    const url = "/metabench/entityDefinition?name=Account";
    return axiosClient.get(url);
  },
};

export default metadataService;
