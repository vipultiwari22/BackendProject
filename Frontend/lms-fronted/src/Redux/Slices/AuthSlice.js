import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstace";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data: localStorage.getItem("data") || {},
};

export const createAccount = createAsyncThunk("/auth/signup", async (data, { dispatch }) => {
  try {
    const response = await axiosInstance.post("user/register", data); // Await response
    const message = response?.data?.message || "Account created successfully!";
    toast.success(message); // Display success message
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message || "Failed to create account");
    throw error; // Ensure error is propagated
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

// export const {} = authSlice.actions;
export default authSlice.reducer;
