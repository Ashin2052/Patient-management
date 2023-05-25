import callApi from "../shared/api";

export const getDashboardData = () => {
  return callApi({
    url: "patient/dashboard",
    method: "get",
  });
};
export const uploadCsv = (formData) => {
  return callApi(
    {
      url: "patient/upload",
      method: "post",
      payload: formData,
    },
    true
  );
};
