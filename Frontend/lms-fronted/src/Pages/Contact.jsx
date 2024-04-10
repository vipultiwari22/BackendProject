import React, { useState } from 'react'
import HomeLayout from '../Layouts/HomeLayout'
import { toast } from 'react-hot-toast'
import { isEmail } from '../Helpers/RegexMatcher'
import axiosInstance from '../Helpers/axiosInstace'

function Contact() {
    const [userInput, setUserInput] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        });
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.email || !userInput.name || !userInput.message) {
            toast.error('All fields are mandatory');
            return;
        }

        if (!isEmail(userInput.email)) {
            toast.error('Invalid email!');
            return;
        }

        try {
            // Make a POST request to the '/contact' endpoint with user input data
            const response = await axiosInstance.post('user/contact', userInput);

            // Show toast messages based on the response
            toast.promise(response, {
                loading: 'Submitting your message...',
                success: 'Form submitted successfully!',
                error: 'Failed to submit the form'
            });

            // If the response indicates success, clear the form inputs
            if (response.data.success) {
                setUserInput({
                    name: '',
                    email: '',
                    message: ''
                });
            }
        } catch (error) {
            // If an error occurs during the POST request, show an error toast message
            toast.error('Operation failed');
        }

    }

    return (
        <HomeLayout>
            <div className='flex items-center justify-center h-[100vh]'>
                <form noValidate
                    onSubmit={onFormSubmit}
                    className='flex flex-col items-center justify-center gap-2 p-5 rounded-md text-white shadow-[0_0_10px_black] w-[22rem]'>

                    <h1 className='text-3xl font-semibold'>Contact Form</h1>
                    <div className='flex flex-col w-full gap-1'>
                        <label htmlFor="name" className='text-lg font-semibold'>
                            Name
                        </label>
                        <input type="text"
                            className='border px-2 py-1 rounded-sm bg-transparent'
                            name="name"
                            id="name"
                            placeholder='Enter your Name'
                            value={userInput.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <label htmlFor="email" className='text-lg font-semibold'>
                            Email
                        </label>
                        <input type="text"
                            className='border px-2 py-1 rounded-sm bg-transparent'
                            name="email"
                            id="email"
                            placeholder='Enter your Email'
                            value={userInput.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <label htmlFor="message" className='text-lg font-semibold'>
                            Message
                        </label>
                        <textarea
                            className='border px-2 py-1 rounded-sm bg-transparent resize-none h-40'
                            name="message"
                            id="message"
                            placeholder='Enter your Message'
                            value={userInput.message}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type='submit' className='w-full bg-yellow-500 hover:bg-yellow-400 transition-all ease-in-out duration-100 rounded-sm py-2 font-semibold text-lg cursor-pointer'>SUBMIT</button>
                </form>
            </div>
        </HomeLayout>
    )
}

export default Contact
