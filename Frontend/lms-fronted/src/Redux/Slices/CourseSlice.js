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


export const createNewCourse = createAsyncThunk('/create/course', async (data) => {
    try {
        const formdata = new FormData()
        formdata.append('title', data?.title)
        formdata.append('description', data?.description)
        formdata.append('category', data?.category)
        formdata.append('createdBy', data?.createdBy)
        formdata.append('thumbnail', data?.thumbnail)

        const response = axiosInstance.post('/courses', formdata)
        toast.promise(response, {
            loading: 'Creating new Course',
            success: 'Course Created Successfully!',
            error: 'failed to create course'
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})


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