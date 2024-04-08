import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { createNewCourse } from '../../Redux/Slices/CourseSlice'
import HomeLayout from '../../Layouts/HomeLayout'
import { AiOutlineArrowLeft } from 'react-icons/ai'

function CreateCourse() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userInput, setUserInput] = useState({
        title: '',
        description: '',
        createdBy: '',
        category: '',
        thumbnail: '',
        previewImage: ''

    })

    const handleImageUpload = (event) => {
        event.preventDefault();
        const uploadedImage = event.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener('load', () => {
                setUserInput({
                    ...userInput,
                    previewImage: fileReader.result, // Change this.result to fileReader.result
                    thumbnail: uploadedImage
                })
            })
        }
    }


    const handelUserInput = (event) => {
        const { name, value } = event.target
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    const onFormSbmit = async (event) => {
        event.preventDefault();
        if (!userInput.title || !userInput.description || !userInput.category || !userInput.createdBy || !userInput.thumbnail) {
            toast.error('All fieldsare mendatory!')
            return;
        }

        const response = await dispatch(createNewCourse(userInput))

        if (response?.payload?.success) {
            setUserInput({
                title: '',
                description: '',
                createdBy: '',
                category: '',
                thumbnail: '',
                previewImage: ''
            })
        }

        navigate('/courses')
    }

    return (
        <HomeLayout>
            <div className='flex items-center justify-center h-[100vh]'>
                <form
                    noValidate
                    onSubmit={onFormSbmit}
                    className='flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] shadow-[0_0_10px_black] relative my-10'
                >
                    <Link className='absolute top-8 text-2xl link text-accent cursor-pointer'>
                        <AiOutlineArrowLeft />
                    </Link>
                    <h1 className='text-center text-2xl font-bold'>Create New Course</h1>
                    <main className='grid grid-cols-2 gap-x-10'>
                        <div className='gap-y-6'>
                            <div className=''>
                                <label htmlFor="ImageUpload" className='cursor-pointer'>
                                    {userInput.previewImage ? (
                                        <img className='w-full h-44 m-auto border' src={userInput.previewImage} alt="" />
                                    ) : (
                                        <div className='flex h-44 m-auto w-full items-center justify-center border'>
                                            <h1 className='font-bold text-xl'>Upload your Course thumbnail</h1>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="Image_uploads"
                                        id="ImageUpload"
                                        accept='.jpg, .jpeg, .png'
                                        onChange={handleImageUpload}
                                        className='hidden'
                                    />
                                </label>
                            </div>
                            <div className=' flex flex-col gap-1 '>
                                <label htmlFor="title" className=' text-xl font-semibold'>Course title</label>
                                <input
                                    required
                                    className=' bg-transparent px-2 py-1 border'
                                    type="text"
                                    placeholder='Enter Course Title'
                                    name="title"
                                    id="title"
                                    value={userInput.title}
                                    onChange={handelUserInput} />
                            </div>
                        </div>
                        <div className=' flex flex-col gap-1 '>
                            <div className=' flex flex-col gap-1 '>
                                <label htmlFor="createdBy" className=' text-xl font-semibold'>Course Instructr</label>
                                <input
                                    required
                                    className=' bg-transparent px-2 py-1 border'
                                    type="text"
                                    placeholder='Enter Course Instructor'
                                    name="createdBy"
                                    id="createdBy"
                                    value={userInput.createdBy}
                                    onChange={handelUserInput} />
                            </div>
                            <div className=' flex flex-col gap-1 '>
                                <label htmlFor="category" className=' text-xl font-semibold'>Course category</label>
                                <input
                                    required
                                    className=' bg-transparent px-2 py-1 border'
                                    type="text"
                                    placeholder='Enter Course Category'
                                    name="category"
                                    id="category"
                                    value={userInput.category}
                                    onChange={handelUserInput} />
                            </div>
                            <div className=' flex flex-col gap-1 '>
                                <label htmlFor="description" className=' text-xl font-semibold'>Course Description</label>
                                <textarea
                                    required
                                    className=' bg-transparent px-2 py-1 border h-24 overflow-y-scroll resize-none'
                                    placeholder='Enter Course Description'
                                    name="description"
                                    id="description"
                                    value={userInput.description}
                                    onChange={handelUserInput} />
                            </div>
                        </div>
                    </main>
                    <button type='submit' className=' w-full bg-yellow-600 hover:bg-yellow-500 text-white transition-all ease-in-out duration-300 py-2 rounded-sm font-semibold text-xl cursor-pointer'>Create Course</button>
                </form>
            </div>
        </HomeLayout >

    )
}

export default CreateCourse