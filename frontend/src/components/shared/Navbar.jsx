import { Avatar } from '@radix-ui/react-avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React from 'react'
import { Button } from '../ui/button'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logouthandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`,
        {
          withCredentials: true
        }
      )
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message)

      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className='bg-white'>
      <div className='container mx-auto flex justify-between items-center max-w-7xl p-4 h-16'>
        <div>
          <h1 className='text-2xl font-bold'>Job<span className='text-blue-500'>Portal</span></h1>
        </div>
        <div className='flex items-center gap-12'>
          <ul className='flex font-medium items-center gap-6'>
            {
              user && user.role === 'recruiter' ? (
                <>
                  <li><Link to="/admin/companies">Campanies</Link></li>
                  <li><Link to="/admin/jobs">Jobs</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/jobs">Jobs</Link></li>
                  <li><Link to="/browse">Browse</Link></li>
                </>
              )
            }


          </ul>
          {
            !user ? (
              <div className='flex items-center gap-4'>
                <Link to="/login"><Button variant="outline" className='px-6'>Login</Button></Link>
                <Link to="/signup"><Button className='px-6'>Sign Up</Button></Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar >
                    <AvatarImage className='w-10 rounded-3xl cursor-pointer' src={user?.profile?.profilePhoto} alt="@shadcn" />

                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='w-80 border-gray-250 border-2 rounded-lg p-4 shadow-lg'>
                  <div className=''>
                    <div className='flex gap-2 space-y-2'>
                      <Avatar >
                        <AvatarImage className='w-10 rounded-3xl cursor-pointer' src={user?.profile?.profilePhoto} alt="@shadcn" />
                      </Avatar>
                      <div>
                        <h4 className='font-medium'>{user?.fullname}</h4>
                        <p className='font-sm text-muted-foreground'>{user?.profile?.bio}</p>
                      </div>
                    </div>
                    <div className='flex flex-col gap-3 '>
                      {
                        user && user.role === 'student' && (
                          <div className='flex w-fit items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
                            <User2 />
                            <Button variant="link"><Link to="/profile">View profile</Link></Button>
                          </div>
                        )
                      }
                      <div className='flex w-fit items-center gap-2 cursor-pointer hover:bg-gray-300 p-2 rounded-md'>
                        <LogOut />
                        <Button  className="bg-gray-400" onClick={logouthandler} variant="link">Logout</Button>
                      </div>
                    </div>
                  </div>

                </PopoverContent>
              </Popover>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default Navbar