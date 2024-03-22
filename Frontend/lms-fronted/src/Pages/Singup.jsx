import React, { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { createAccount } from "../Redux/Slices/AuthSlice";

function Singup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [prevImage, setPrevImage] = useState("");

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  function getImage(event) {
    event.preventDefault();

    const UploadedImage = event.target.files[0];
    if (UploadedImage) {
      setSignupData({
        ...signupData,
        avatar: UploadedImage,
      });
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(UploadedImage);
    fileReader.addEventListener("load", function () {
      console.log(this.result);
      setPrevImage(this.result);
    });
  }

  async function createNewAccount(event) {
    event.preventDefault();

    if (
      !signupData.email ||
      !signupData.password ||
      !signupData.fullName ||
      !signupData.avatar
    ) {
      toast.error("Please fill all the details");
      return;
    }

    // Checking name field length
    if (signupData.fullName.length < 5) {
      toast.error("Name should be at least 5 characters long");
      return;
    }

    if (
      !signupData.email.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )
    ) {
      toast.error("Invalid email address");
      return;
    }

    if (
      !signupData.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      toast.error(
        "Password should be 8 or more characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
      );
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);
    try {
      // Dispatch createAccount action
      const response = await dispatch(createAccount(formData));

      if (response?.payload?.success) {
        toast.success("Account created successfully!"); // Show success message
        navigate("/"); // Navigate to desired page
        setSignupData({
          fullName: "",
          email: "",
          password: "",
          avatar: "",
        });
        setPrevImage("");
      }
    } catch (error) {
      // Handle errors if any
      console.error("Error creating account:", error);
      // Display appropriate error message to the user
      toast.error("Failed to create account. Please try again later.");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Registration Page</h1>
          <label htmlFor="imageUpload" className="cursor-poiter">
            {prevImage ? (
              <img
                src={prevImage}
                className="w-24 h-24 m-auto rounded-full"
                alt="userImage"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            onChange={getImage}
            type="file"
            accept=".jpg,.jpeg,.png,.svg"
            className="hidden"
            name="image_uploads"
            id="imageUpload"
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              required
              name="fullName"
              id="fullName"
              placeholder="Enter you fullName"
              className="px-2 py-1 border bg-transparent"
              onChange={handleUserInput}
              value={signupData.fullName}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter you email"
              className="px-2 py-1 border bg-transparent"
              onChange={handleUserInput}
              value={signupData.email}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter you password"
              className="px-2 py-1 border bg-transparent"
              onChange={handleUserInput}
              value={signupData.password}
            />
          </div>
          <button
            className="mt-3 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            Create Account
          </button>

          <p className="text-center">
            Alredy have an account ?{" "}
            <Link to="/login" className="link text-accent cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Singup;
