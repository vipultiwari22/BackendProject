import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstace";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data: localStorage.getItem("data") == undefined ? JSON.parse(localStorage.getItem('data')) : {}
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

export const login = createAsyncThunk("/auth/login", async (data, { dispatch }) => {
  try {
    const response = await axiosInstance.post("user/login", data); // Await response
    const message = response?.data?.message || "login successfully!";
    toast.success(message); // Display success message
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message || "Failed to login account");
    throw error; // Ensure error is propagated
  }
});

export const logout = createAsyncThunk('/auth/logout', async () => {
  try {
    const response = await axiosInstance.get("user/logout"); // Await response
    const message = response?.data?.message || "logout successfully!";
    toast.success(message); // Display success message
    return response.data; // Return response data
  } catch (error) {
    toast.error(error.response.data.message || "Failed to logout account");
    throw error; // Ensure error is propagated
  }
});


export const updateProfile = createAsyncThunk('/user/update/profile', async (id, data) => {
  console.log('update', id, data);
  try {
    const response = await axiosInstance.put(`/user/update/${id}`, data); // Await response
    const message = response?.data?.message || "Profile Update successfully!";
    toast.success(message); // Display success message
    return response.data; // Return response data
  } catch (error) {
    toast.error(error.response.data.message || "Failed to Update Profile");
    throw error; // Ensure error is propagated
  }
});

export const getuserData = createAsyncThunk('/user/details', async () => {
  try {
    const response = await axiosInstance.get(`user/me`); // Await response
    return response.data; // Return response data
  } catch (error) {
    throw error.message; // Ensure error is propagated
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem('data', JSON.stringify(action?.payload?.user));
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('role', action?.payload?.user?.role)
      state.isLoggedIn = true
      state.data = action?.payload?.user
      state.role = action?.payload?.user?.role
    }).addCase(logout.fulfilled, (state, action) => {
      localStorage.clear()
      state.data = {}
      state.isLoggedIn = false
      state.role = ''
    }).addCase(getuserData.fulfilled, (state, action) => {
      if (!action?.payload?.user) return;
      localStorage.setItem('data', JSON.stringify(action?.payload?.user));
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('role', action?.payload?.user?.role)
      state.isLoggedIn = true
      state.data = action?.payload?.user
      state.role = action?.payload?.user?.role
    })
  }
});

// export const {} = authSlice.actions;
export default authSlice.reducer;
