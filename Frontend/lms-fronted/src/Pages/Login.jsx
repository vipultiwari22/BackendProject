import React, { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { login } from "../Redux/Slices/AuthSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    }

    async function onLogin(event) {
        event.preventDefault();

        if (!loginData.email || !loginData.password) {
            toast.error("Please fill all the details");
            return;
        }

        // Checking name field length
        try {
            // Dispatch createAccount action
            const response = await dispatch(login(loginData));

            if (response?.payload?.success) {
                toast.success("Account Login successfully!"); // Show success message
                navigate("/"); // Navigate to desired page
                setLoginData({
                    email: "",
                    password: "",
                });
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
                    onSubmit={onLogin}
                    className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
                >
                    <h1 className="text-center text-2xl font-bold">Login Page</h1>

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
                            value={loginData.email}
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
                            value={loginData.password}
                        />
                    </div>
                    <button
                        className="mt-3 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
                        type="submit"
                    >
                        Login Account
                    </button>

                    <p className="text-center">
                        Alredy have an account ?{" "}
                        <Link to="/singup" className="link text-accent cursor-pointer">
                            Singup
                        </Link>
                    </p>
                </form>
            </div>
        </HomeLayout>
    );
}

export default Login;
