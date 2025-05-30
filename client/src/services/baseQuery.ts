import axiosInstance from "./axiosInstance";

const axiosBaseQuery = () => async (args: any) => {
  const { url, method, body, params } = args;
  try {
    const result = await axiosInstance({
      url,
      method,
      data: body,
      params,
    });
    return { data: result.data };
  } catch (error: any) {
    const err = error;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

export default axiosBaseQuery;
