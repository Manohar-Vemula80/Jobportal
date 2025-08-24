import Navbar from '@/components/shared/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { setsearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
  // fetch jobs into redux (your existing hook)
  useGetAllJobs();

  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // update redux search text whenever input changes
  useEffect(() => {
    dispatch(setsearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between'>
          <Input
            className="w-fit"
            placeholder='Filter by name or role'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate('/admin/job/create')}>New Jobs</Button>
        </div>

        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs
