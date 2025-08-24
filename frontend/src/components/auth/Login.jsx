import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup } from '../ui/radio-group'
import axios from 'axios'
import { toast } from 'sonner'
import { USER_API_END_POINT } from '../../utils/constant'
import { useEffect } from 'react'
import { setLoading } from '@/redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { setUser } from '@/redux/authSlice'

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    role: ''
  })
  const { loading,user } = useSelector((store) => store.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        input,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate('/')
        toast.success(res.data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
    } finally {
      dispatch(setLoading(false));
    }
  }
   useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form
          onSubmit={submitHandler}
          className='w-1/2 border border-gray-200 rounded-md p-4 my-10'
        >
          <h1 className='font-bold text-xl mb-5'>Login</h1>

          <div className='my-2'>
            <Label>Email</Label>
            <Input
              className='mt-2'
              type='email'
              name='email'
              value={input.email}
              onChange={changeEventHandler}
              placeholder='you@example.com'
            />
          </div>

          <div className='my-2'>
            <Label>Password</Label>
            <Input
              className='mt-2'
              type='password'
              name='password'
              value={input.password}
              onChange={changeEventHandler}
              placeholder='••••••••'
            />
          </div>

          <div className='flex items-center justify-between'>
            <RadioGroup className='flex items-center gap-4 my-5'>
              <div className='flex items-center space-x-2'>
                <Input
                  type='radio'
                  name='role'
                  value='student'
                  checked={input.role === 'student'}
                  onChange={changeEventHandler}
                  className='cursor-pointer'
                />
                <Label>Student</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Input
                  type='radio'
                  name='role'
                  value='recruiter'
                  checked={input.role === 'recruiter'}
                  onChange={changeEventHandler}
                  className='cursor-pointer'
                />
                <Label>Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
          {
            loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Login</Button>
          }
          <span className='text-sm'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-blue-600'>
              Sign up
            </Link>
          </span>
        </form>
      </div>
    </>
  )
}

export default Login
