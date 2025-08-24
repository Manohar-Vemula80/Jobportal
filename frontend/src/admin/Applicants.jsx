import Navbar from '@/components/shared/Navbar'
import React, { useEffect } from 'react'
import ApplicantsTable from './ApplicantsTable'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { setAllApplicants } from '@/redux/applicationSlice'

const Applicants = () => {
    const params=useParams();
    const {applicants}=useSelector(store=>store.application)
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchAllapplicants=async ()=>{
            try {
                const res =await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`,{
                    withCredentials:true
                })
               dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllapplicants();
    },[])
  return (
    <div>
        <Navbar/>
        <div className='max-w-7xl mx-auto'>
            <h1 className='font-bold text-xl my-5'>Applicants{applicants?.applications?.length}</h1>
            <ApplicantsTable/>
        </div>
    </div>
  )
}

export default Applicants