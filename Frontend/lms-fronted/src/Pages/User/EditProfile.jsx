import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { getuserData, updateProfile } from '../../Redux/Slices/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import { BsPersonCircle } from 'react-icons/bs';
import { AiOutlineArrowLeft } from 'react-icons/ai';


function EditProfile() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [data, setData] = useState({
        previewImage: '',
        fullName: '',
        avatar: undefined,
        userId: useSelector((state) => state?.auth?.data?._id)
    });

    const handleImageUpload = (e) => {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(uploadedImage)
            fileReader.addEventListener('load', () => {
                setData({
                    ...data,
                    previewImage: fileReader.result,
                    avatar: uploadedImage
                })
            })
        }

    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault()
        console.log(data);
        if (!data.fullName || !data.avatar) {
            toast.error('All fields are mendatory!')
            return;
        }
        if (data.fullName.length < 5) {
            toast.error('Name should not be less than 5 charecter')
        }
        const formData = new FormData();
        formData.append('fullname', data.fullName)
        formData.append('avatar', data.avatar)

        await dispatch(updateProfile(data.userId, formData))

        await dispatch(getuserData())

        navigate('/user/Profile');

    }

    return (
        <HomeLayout>
            <div className='flex items-center justify-center h-[100vh]'>
                <form
                    onSubmit={onFormSubmit}
                    className='flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]'
                >
                    <h1 className='text-center text-2xl font-semibold'>Edit Profile</h1>

                    <label htmlFor='image_upload' className='w-28 h-28 rounded-full m-auto cursor-pointer'>
                        {data.previewImage ? (
                            <img className='w-28 h-28 rounded-full m-auto' src={data.previewImage} alt="" />
                        ) : (
                            <BsPersonCircle className='w-28 h-28 rounded-full m-auto' />
                        )}
                    </label>
                    <input type="file" onChange={handleImageUpload}
                        className='hidden'
                        id='image_upload'
                        name='image_upload'
                        accept='.jpg,.png,.jpeg,.svg'
                    />
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="fllName" className='text-lg font-semibold'>Full Name</label>
                        <input type="text"
                            required
                            name='fullName'
                            id='fullName'
                            placeholder='Enter your Name'
                            className='bg-transparent px-2 py-1 border'
                            value={data.fullName}
                            onChange={handleInputChange}
                        />
                        <button type='submit' className='w-full bg-yellow-600 hover:bg-yello-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer'>UpdateProfile</button>
                        <Link to='/user/Profile'>
                            <AiOutlineArrowLeft />
                            <p className='text-accent cursor-pointer flex items-center justify-center w-full gap-2'>Go Back to profile</p>
                        </Link>

                    </div>
                </form>

            </div>
        </HomeLayout>
    )

}

export default EditProfile