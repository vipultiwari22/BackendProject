import React from 'react'
import { useNavigate } from 'react-router-dom'

function Denied() {
    const Navigate = useNavigate();
    return (
        <main className='h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]'>
            <h1 className='text-9xl font-extrabold text-white tracking-widest'>
                403
            </h1>
            <div className='bg-black text-white px-2 text-sm rounded-sm rotate-12 absolute'>Accsess Denied</div>
            <button onClick={() => Navigate(-1)} className='mt-5'>
                <span className='block relative text-white px-8 py-3 bg-[#1A2238] border border-current'>Go Back</span>
            </button>
        </main>
    )
}

export default Denied