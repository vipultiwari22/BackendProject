import React from 'react'
import { useNavigate } from 'react-router-dom'

function CourseCard({ data }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate('/course/description', { state: { ...data } })}
            className='w-[22rem] text-white h-[430px] shadow-lg cursor-pointer group overflow-hidden'>
            <div className='overflow-hidden'>
                <img src={data?.thumbnail?.secure_url} className='h-40 w-full rounded-tl-lg rounded-tr-lg group-hover:scale[1,2] transition-all ease-out duration-300' alt="course thumbnail" />
            </div>
            <div className='p-3 space-y-1 text-white'>
                <h2 className='text-xl font-bold text-yellow-500 line-clamp-2'>
                    {data?.title}
                </h2>
                <p className='line-clamp-2'>
                    {data?.description}
                </p>
                <p className='font-semibold'>
                    <span className='text-yellow-500 font-bold'>Categotry:</span>
                    {data?.category}
                </p>
                <p className='font-semibold'>
                    <span className='text-yellow-500 font-bold'>Total Lectures:</span>
                    {data?.numbersOfLectures}
                </p>
                <p className='font-semibold'>
                    <span className='text-yellow-500 font-bold'>Instructor:</span>
                    {data?.createdBy}
                </p>
            </div>
        </div>
    )
}

export default CourseCard