import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import Navbar from '@/components/shared/Navbar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'

const CompanySetup = () => {
  const params = useParams()
  const companyId = params.id

  // this custom hook should fetch company data into redux (keep using it)
  useGetCompanyById(companyId)

  const { singleCompany } = useSelector(store => store.company)
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null
  })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true) // loading until we populate form
  const navigate = useNavigate()

  // update local form state only when singleCompany exists
  useEffect(() => {
    if (!singleCompany) {
      // keep showing initial loading until we have the company
      setInitialLoading(true)
      return
    }

    setInput({
      name: singleCompany.name ?? "",
      description: singleCompany.description ?? "",
      website: singleCompany.website ?? "",
      location: singleCompany.location ?? "",
      // if company stores file url, keep it null in file input initial
      file: null
    })
    setInitialLoading(false)
  }, [singleCompany])

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0] ?? null
    setInput({ ...input, file })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("name", input.name)
    formData.append("description", input.description)
    formData.append("website", input.website)
    formData.append("location", input.location)
    if (input.file) formData.append("file", input.file)

    try {
      setLoading(true)
      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${companyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
      if (res.data.success) {
        toast.success(res.data.message || "Company updated")
        navigate("/admin/companies")
      } else {
        toast.error(res.data.message || "Failed to update")
      }
    } catch (error) {
      console.error('update company error:', error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // show loading UI while we wait for company to be populated into store
  if (initialLoading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-xl mx-auto my-20 text-center">
          <Loader2 className="mx-auto mb-4 animate-spin" />
          <p>Loading company details...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className='max-w-xl mx-auto my-10'>
        <form onSubmit={submitHandler}>
          <div className='flex items-center gap-5 p-8'>
            <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className='font-bold text-xl'>Company Setup</h1>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
            </div>
          </div>

          {
            loading
              ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>
              : <Button type="submit" className="w-full my-4">Update</Button>
          }
        </form>
      </div>
    </div>
  )
}

export default CompanySetup
