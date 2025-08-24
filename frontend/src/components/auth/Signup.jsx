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
import { setLoading } from '@/redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: ""
  })
  const [file, setFile] = useState(null)
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeEventHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const changeFileHandler = e => {
    setFile(e.target.files?.[0] || null)
  }

  const submitHandler = async e => {
    e.preventDefault()

    // Build FormData
    const formData = new FormData()
    formData.append("fullname", input.fullname)
    formData.append("email", input.email)
    formData.append("phoneNumber", input.phoneNumber)
    formData.append("password", input.password)
    formData.append("role", input.role)
    if (file) formData.append("file", file)

    // 🔍 DEBUG: Inspect what you're about to send
    console.group("SignUp Payload")
    console.log("State:", input, "File:", file)
    for (let [key, val] of formData.entries()) {
      console.log(`${key}:`, val)
    }
    console.groupEnd()

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        return navigate("/login")
      }
    } catch (error) {
      // 🔍 DEBUG: Inspect the backend response
      console.error("Signup error response:", error.response?.data)
      toast.error(
        error.response?.data?.message ||
        "Signup failed — check console for details"
      )
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>

          <div className="my-2">
            <Label>Full Name</Label>
            <Input
              className="mt-2"
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="Your name"
            />
          </div>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              className="mt-2"
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="you@example.com"
            />
          </div>

          <div className="my-2">
            <Label>Phone Number</Label>
            <Input
              className="mt-2"
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="8080808080"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              className="mt-2"
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                />
                <Label>Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                />
                <Label>Recruiter</Label>
              </div>
            </RadioGroup>

            <div className="flex items-center gap-2">
              <Label>Profile</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>

          {
            loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Sign up</Button>
          }

          <span className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </>
  )
}

export default Signup
