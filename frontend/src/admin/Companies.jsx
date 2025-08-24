import Navbar from '@/components/shared/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import CampaniesTable from './CampaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'


const Companies = () => {
    useGetAllCompanies();
    const [input,setInput]=useState("");
    const dispatch=useDispatch();
    const navigate=useNavigate();
    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));

    },[input]);
    // console.log(input)
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between'>
                    <Input
                        className="w-fit"
                        placeholder='Filter by name'
                        onChange={(e)=>setInput(e.target.value)}
                    />
                    <Button onClick={()=>navigate('/admin/companies/create')}>New Company</Button>

                </div>
                <CampaniesTable/>
            </div>
        </div>

    )
}

export default Companies