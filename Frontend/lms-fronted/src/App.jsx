import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AboutUs from "./Pages/AboutUs";
import NotFound from "./Pages/NotFound";
import Singup from "./Pages/Singup";
import Login from "./Pages/Login";
import Course from "./Pages/CoursesPages/Course";
import Contact from "./Pages/Contact";
import Denied from "./Pages/Denied";
import CourseDescription from "./Pages/CoursesPages/CourseDescription";
import RequireAuth from "./Components/Auth/RequireAuth";
import CreateCourse from "./Pages/CoursesPages/CreateCourse";
import UserProfile from "./Pages/User/UserProfile";
import EditProfile from "./Pages/User/EditProfile";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/About" element={<AboutUs />}></Route>
        <Route path="/singup" element={<Singup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/courses" element={<Course />}></Route>
        <Route path="/contactUs" element={<Contact />}></Route>
        <Route path="/denied" element={<Denied />}></Route>
        <Route path="/course/description" element={<CourseDescription />}></Route>

        <Route element={<RequireAuth allowedRole={['ADMIN']} />}>
          <Route path="/course/create" element={<CreateCourse />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRole={['ADMIN', 'USER']} />}>
          <Route path="/user/profile" element={<UserProfile />} ></Route>
          <Route path="/user/editProfile" element={<EditProfile />}></Route>
        </Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
}

export default App;
