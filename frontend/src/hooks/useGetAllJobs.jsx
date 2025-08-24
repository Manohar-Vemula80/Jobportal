import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { useRef } from 'react'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    // const fetched = useRef(false);
    const {searchedQuery} = useSelector(store=>store.job);
    useEffect(()=>{
        // if(fetched.current) return; // Prevent fetching if already fetched
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                    // fetched.current = true;
                    // console.log("All jobs fetched successfully:", res.data.jobs);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    },[ searchedQuery,dispatch]);
}

export default useGetAllJobs