import api from "./api";

export const getProjectActivities = async (projectId) => {
  const response = await api.get(
    `/activities/project/${projectId}`
  );

  return response.data;
};