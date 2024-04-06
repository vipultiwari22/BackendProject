import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"
import axiosInstance from "../../Helpers/axiosInstace"

const initialState = {
    courseData: []
}

export const getAllCourses = createAsyncThunk('/courses', async () => {
    try {
        console.log("Fetching courses...");
        const response = await axiosInstance.get('/courses');
        toast.promise(Promise.resolve(response), {
            loading: 'Loading Course Data',
            success: 'Courses Loaded Successfully',
            error: 'Failed to get the courses'
        });
        return response.data.giveMeAllCourses;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});



const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            if (action.payload) {
                console.log(action.payload);
                state.courseData = [...action.payload]
            }
        })
    }
})

export default courseSlice.reducer;