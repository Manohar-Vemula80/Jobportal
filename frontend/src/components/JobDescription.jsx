import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    const [isApplied, setIsApplied] = useState(false);
    const [loadingJob, setLoadingJob] = useState(true);
    const [loadingApply, setLoadingApply] = useState(false);
    const [checkingApplied, setCheckingApplied] = useState(true);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    // fetch job details
    useEffect(() => {
        const fetchSingleJob = async () => {
            setLoadingJob(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                } else {
                    toast.error(res.data.message || 'Unable to load job');
                }
            } catch (error) {
                console.log('fetchSingleJob error:', error);
                toast.error('Failed to load job');
            } finally {
                setLoadingJob(false);
            }
        };
        fetchSingleJob();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId, dispatch]);

    // authoritative check: has current user applied? (server-side)
    useEffect(() => {
        const checkIfApplied = async () => {
            setCheckingApplied(true);
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/check/${jobId}`, { withCredentials: true });
                if (res.data?.success) {
                    setIsApplied(!!res.data.alreadyApplied);
                } else {
                    setIsApplied(false);
                }
            } catch (err) {
                console.log('checkIfApplied error:', err);
                setIsApplied(false);
            } finally {
                setCheckingApplied(false);
            }
        };
        checkIfApplied();
    }, [jobId]);

    const applyJobHandler = async () => {
        // absolute guard
        if (isApplied) {
            toast('You have already applied for this job');
            return;
        }
        if (loadingJob || checkingApplied) {
            toast('Please wait...');
            return;
        }
        if (loadingApply) return;

        // optimistic UI change: immediately show applied state
        setIsApplied(true);
        setLoadingApply(true);

        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, { withCredentials: true });

            // server may return alreadyApplied:true OR success:true (201)
            if (res.data?.alreadyApplied) {
                // we already set UI to applied — just inform user
                toast('You have already applied for this job');
                // no revert needed
                return;
            }

            if (res.data?.success) {
                // confirm optimistic UI, update store
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...(singleJob?.applications || []), { applicant: user?._id }]
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message || 'Application submitted');
            } else {
                // unexpected server response: revert optimistic state and show error
                setIsApplied(false);
                toast.error(res.data?.message || 'Unable to apply right now');
            }
        } catch (error) {
            // revert optimistic UI on actual error
            setIsApplied(false);
            const msg = error.response?.data?.message || 'Something went wrong';
            if (msg === 'You have already applied for this job') {
                // server says already applied; show info and set applied true
                setIsApplied(true);
                toast('You have already applied for this job');
            } else {
                toast.error(msg);
            }
            console.log('applyJobHandler error (handled):', msg);
        } finally {
            setLoadingApply(false);
        }
    }

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.postion} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>

                {/* NOTE: hover:bg same as bg so hover doesn't change look */}
                <Button
                    onClick={applyJobHandler}
                    disabled={isApplied || loadingJob || loadingApply || checkingApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#7209b7]'}`}>
                    {isApplied ? 'Already Applied' : (loadingApply ? 'Applying...' : 'Apply Now')}
                </Button>
            </div>

            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt?.split("T")[0]}</span></h1>
            </div>
        </div>
    )
}

export default JobDescription
