import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const login = async (credentials) => {
  try {

    const response = await axiosClient.post(API_ENDPOINTS.login, credentials);
    if (response.status === 200) {
      console.log('login response', response.data);
      const data = response.data;
      if (data) {
        return data;
      } else {
        // Construct an error message
        const errorMessage = data.error ? `${data.message}: ${data.error}` : data.message;
        throw new Error(errorMessage);
      }
    } else {
      console.log('login response', response);
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    
    console.log('login Error', error.response.data);

    throw new Error(error.response?.data || 'An error occurred during login');
  }
};


export const getAllWorkerList = async (): Promise<any> => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.workerList);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching All worker list data:", error);
    throw new Error(error?.message || "An error occurred while fetching Worker data");
  }
};