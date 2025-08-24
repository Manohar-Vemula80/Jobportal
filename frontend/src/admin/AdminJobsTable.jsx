import React, { useMemo } from 'react'
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from '../components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => {
  const navigate = useNavigate()

  // Defensive selectors: handle different reducer shapes
  const jobSlice = useSelector(state => state.job) || {}
  const companySlice = useSelector(state => state.company) || {}

  // common job array keys (pick first that exists)
  const jobsArr = jobSlice.allJobs ?? jobSlice.allAdminJobs ?? jobSlice.jobs ?? jobSlice.data ?? []
  const companiesArr = companySlice.companies ?? companySlice.data ?? []

  // search text comes from job slice (set by parent)
  const searchText = (jobSlice.searchJobByText ?? jobSlice.searchjobByText ?? jobSlice.searchText ?? '').trim().toLowerCase()

  // Build company id -> name map (fast lookup)
  const companyMap = useMemo(() => {
    const m = new Map()
    if (Array.isArray(companiesArr)) {
      companiesArr.forEach(c => {
        if (!c) return
        const id = String(c._id ?? c.id ?? c)
        const name = c.name ?? c.companyName ?? String(c)
        m.set(id, name)
      })
    }
    return m
  }, [companiesArr])

  // Normalize jobs and compute companyName for each job
  const normalizedJobs = useMemo(() => {
    if (!Array.isArray(jobsArr)) return []
    return jobsArr.map(job => {
      const companyField = job?.company
      let companyName = '—'

      if (companyField && typeof companyField === 'object') {
        companyName = companyField.name ?? companyField.companyName ?? String(companyField._id ?? '—')
      } else if (companyField) {
        const cid = String(companyField)
        companyName = companyMap.get(cid) ?? cid
      }

      return {
        ...job,
        companyName
      }
    })
  }, [jobsArr, companyMap])

  // Filter by company name OR job title
  const filtered = useMemo(() => {
    if (!searchText) return normalizedJobs
    return normalizedJobs.filter(j => {
      const name = (j.companyName ?? '').toString().toLowerCase()
      const title = (j.title ?? '').toString().toLowerCase()
      return name.includes(searchText) || title.includes(searchText)
    })
  }, [normalizedJobs, searchText])

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No jobs found
              </TableCell>
            </TableRow>
          ) : (
            filtered.map(job => {
              const keyId = job._id ?? job.id ?? `${job.companyName}-${job.title}`
              const date = job?.createdAt ? String(job.createdAt).split('T')[0] : '—'
              return (
                <TableRow key={keyId}>
                  <TableCell>{job.companyName}</TableCell>
                  <TableCell>{job.title ?? '—'}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                      <PopoverContent className="w-32">
                        <div >
                            
                        <div onClick={()=>navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-25 gap-2 pl-1.5 cursor-pointer mt-2 rounded-2xl bg-gray-300   '>
                            <Eye className='w-4'/>
                            <span>Applicants</span>
                        </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminJobsTable
