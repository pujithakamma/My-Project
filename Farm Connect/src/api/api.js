import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000"
});

// ==================== USER APIs ====================
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/users/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Registration failed" };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Login failed" };
  }
};

export const fetchAllProducts = async () => {
  try {
    const response = await API.get("/products");
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Failed to fetch products" };
  }
};

export const fetchAllFarmers = async () => {
  try {
    const response = await API.get("/farmers");
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Failed to fetch farmers" };
  }
};

export const getOrderStats = async () => {
  try {
    const response = await API.get("/orders/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Failed to fetch order stats" };
  }
};

export default API;
