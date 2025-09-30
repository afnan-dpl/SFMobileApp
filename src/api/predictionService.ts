import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const getAllPredictionAPI = async (): Promise<any> => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.predictionList);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching All prediction data:", error);
    throw new Error(error?.message || "An error occurred while fetching prediction data");
  }
};

export const getPredictionAPIByUserId = async (userID: String): Promise<any> => {
  try {
    const response = await axiosClient.get(
      `${API_ENDPOINTS.predictionByUserId}${userID}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching prediction data by user id:", error);
    throw new Error(
      error?.message || "An error occurred while fetching prediction dat by user id"
    );
  }
};


export const getLatestPredictionAPI = async (): Promise<any> => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.predictionList);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching All prediction data:", error);
    throw new Error(error?.message || "An error occurred while fetching prediction data");
  }
};

export const getPredictionAPIByPageNumber = async (pageNumber: number): Promise<any> => {
  try {
    const response = await axiosClient.get(
      `${API_ENDPOINTS.predictionByPageNumber}${pageNumber}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching prediction data:", error);
    throw new Error(
      error?.message || "An error occurred while fetching prediction data"
    );
  }
};


export const getPredictionAPIByType = async (type: String): Promise<any> => {
  try {
    const response = await axiosClient.get(
      `${API_ENDPOINTS.predictionByType}${type}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching prediction data by Type:", error);
    throw new Error(
      error?.message || "An error occurred while fetching prediction dat by type"
    );
  }
};

export const getLatestRecordById = async (id: number): Promise<any> => {
  try {
    const response = await axiosClient.get(
      `${API_ENDPOINTS.checkLatestRecordByID}${id}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching prediction data by ID:", error);
    throw new Error(
      error?.message || "An error occurred while fetching prediction dat by Id"
    );
  }
};


export const getTodayPredictionAPI = async (): Promise<any> => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.predictionByLastDays + '0');
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching All prediction Today data:", error);
    throw new Error(error?.message || "An error occurred while fetching prediction Today data");
  }
};


export const getLastPredictionByUserAPI = async (): Promise<any> => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.getLastPredictionByUser );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching All prediction  by user type:", error);
    throw new Error(error?.message || "An error occurred while fetching prediction type");
  }
};

export const getHistoryPredictionAPI = async (): Promise<any> => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.predictionByLastDays );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching All prediction Today data:", error);
    throw new Error(error?.message || "An error occurred while fetching prediction Today data");
  }
};


export const getActivitySummaryAPI = async (date: String): Promise<any> => {
  try {
    const response = await axiosClient.get(
      `${API_ENDPOINTS.getActivitySummary}${date}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error: any) {
    console.error("Error fetching daily activity sumary data by 1", error);
    throw new Error(
      error?.message || "An error occurred while fetching prediction dat by Id"
    );
  }
};

