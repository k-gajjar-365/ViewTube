import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const Register = () => {

    const [user, setUser] = useState({ email: "", username: "", password: ""})
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(user.email.length === 0 || user.username.length === 0 || user.password.length === 0) {
            setButtonDisabled(true)
        } else {
            setButtonDisabled(false)
        }
    }, [user])
    


  return (
    <div className='flex items-center h-screen justify-center'>
        <div className='text-center p-8 rounded-xl bg-[#151515] shadow-2xl shadow-black md:w-120 lg:w-180'>
            <h1 className='font-extrabold text-4xl mb-8'>Register Form</h1>
            <form className='flex flex-col font-mono p-5 gap-10 mb-2'>
                <input onChange={(e) => setUser({...user, username: e.target.value})} value={user.username} type="text" className='shadow-md outline-none shadow-black p-3  rounded-lg ' placeholder='Username' />
                <input onChange={(e) => setUser({...user, email: e.target.value})} value={user.email} type="email" className='shadow-md outline-none shadow-black p-3  rounded-lg ' placeholder='Email' />
                <input onChange={(e) => setUser({...user, password: e.target.value})} value={user.password} type="password" className='shadow-md outline-none shadow-black p-3  rounded-lg ' placeholder='Password' />
                <button disabled={buttonDisabled} className={`${buttonDisabled ? "bg-gray-600 hover:cursor-not-allowed" : "bg-[#ae7aff] hover:bg-[#9f65fd]"} p-3 rounded-lg cursor-pointer transition-all duration-300 shadow-xl shadow-black `}>{loading ? "Loading..." : "Register"}</button>
            </form>
            <span>Already have an account ? <Link to={"/login"} className='text-indigo-600 hover:underline'>Login</Link></span>
        </div>
    </div>  
  )
}

export default Register