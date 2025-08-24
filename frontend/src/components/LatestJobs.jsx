import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs'; // ✅ import custom hook

const LatestJobs = () => {
    useGetAllJobs();
    // ✅ this is where the hook is used

    const allJobs = useSelector((store) => store.job?.allJobs || []);

    // ✅ Filter unique jobs by _id to avoid duplicates
    const uniqueJobs = Array.from(
        new Map(allJobs.map(job => [job._id, job])).values()
    );

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'>
                <span className='text-[#6A38C2]'>Latest & Top </span> Job Openings
            </h1>
            <div className='grid grid-cols-3 gap-4 my-5'>
                {
                    uniqueJobs.length === 0
                        ? <span>No Job Available</span>
                        : uniqueJobs.slice(0, 6).map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))
                }
            </div>
        </div>
    );
};

export default LatestJobs;
